import { useState, useEffect, useCallback } from 'react';
import { useMessaging } from './useMessaging';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { FeedbackService, FEEDBACK_RECIPIENT_ADDRESS } from '../services/feedbackService';
import { trackEvent, trackError } from '../utils/analytics';

export interface FeedbackState {
  isOpen: boolean;
  isSending: boolean;
  error: string | null;
  hasSentFeedback: boolean;
  hasOptedOut: boolean;
  shouldShowPrompt: boolean;
  showBubble: boolean;
}

export const useFeedback = () => {
  const { createChannel, sendMessage, isReady, channels, fetchChannels } = useMessaging();
  const currentAccount = useCurrentAccount();

  const [state, setState] = useState<FeedbackState>({
    isOpen: false,
    isSending: false,
    error: null,
    hasSentFeedback: FeedbackService.hasSentFeedback(),
    hasOptedOut: FeedbackService.hasOptedOut(),
    shouldShowPrompt: false,
    showBubble: false,
  });

  // Check if we should show feedback prompt
  useEffect(() => {
    const shouldShow = FeedbackService.shouldShowFeedback();
    const interactionCount = FeedbackService.getInteractionCount();
    const showBubble = interactionCount >= 3 && !FeedbackService.hasOptedOut();

    setState(prev => ({
      ...prev,
      shouldShowPrompt: shouldShow,
      showBubble,
    }));
  }, []);

  // Track interaction
  const trackInteraction = useCallback(() => {
    if (!FeedbackService.hasOptedOut()) {
      FeedbackService.incrementInteractionCount();
      const interactionCount = FeedbackService.getInteractionCount();

      // Check if we should now show the prompt (only if not already shown)
      if (FeedbackService.shouldShowFeedback() && !state.isOpen && !FeedbackService.hasShownCard()) {
        setState(prev => ({
          ...prev,
          shouldShowPrompt: true,
          isOpen: true,
          showBubble: true,  // Also show bubble when card opens
        }));
        FeedbackService.markCardShown();
        trackEvent('feedback_shown', { trigger: 'auto' });
      } else if (interactionCount >= 3 && !FeedbackService.hasOptedOut()) {
        // Just show the bubble if we've already shown the card before
        setState(prev => ({
          ...prev,
          showBubble: true,
        }));
      }
    }
  }, [state.isOpen]);

  // Open feedback card
  const openFeedback = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      error: null,
    }));
    trackEvent('feedback_shown', { trigger: 'manual' });
  }, []);

  // Close feedback card
  const closeFeedback = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      shouldShowPrompt: false,  // Reset this to prevent re-opening
      error: null,
    }));
    trackEvent('feedback_dismissed');
  }, []);

  // Handle opt out
  const handleOptOut = useCallback((optOut: boolean) => {
    FeedbackService.setOptOut(optOut);
    setState(prev => ({
      ...prev,
      hasOptedOut: optOut,
      showBubble: !optOut && FeedbackService.getInteractionCount() >= 3,
    }));
    if (optOut) {
      trackEvent('feedback_opt_out');
    }
  }, []);

  // Get or create feedback channel
  const getOrCreateFeedbackChannel = useCallback(async (): Promise<string | null> => {
    // Check if we already have a channel ID stored
    let channelId = FeedbackService.getFeedbackChannelId();

    if (!channelId) {
      // Fetch current channels if needed
      if (channels.length === 0) {
        await fetchChannels();
      }

      // Look for existing direct channel with feedback recipient (exactly 2 members)
      const feedbackChannel = channels.find(channel => {
        const members = channel.auth.member_permissions.contents;

        // Must be a direct channel (2 members only)
        if (members.length !== 2) return false;

        // Check if one of the members is the feedback recipient
        const hasFeedbackRecipient = members.some((member: any) => {
          // Member might be an object with address property or a string
          const memberAddress = typeof member === 'string' ? member : member.address;
          return memberAddress &&
                 memberAddress.toLowerCase() === FEEDBACK_RECIPIENT_ADDRESS.toLowerCase();
        });

        return hasFeedbackRecipient;
      });

      if (feedbackChannel) {
        // Found existing channel, store and use it
        channelId = feedbackChannel.id.id as string;
        FeedbackService.setFeedbackChannelId(channelId);
        trackEvent('feedback_submitted', { action: 'channel_reused', channel_id: channelId });
      } else {
        // Create new channel with feedback recipient
        const result = await createChannel([FEEDBACK_RECIPIENT_ADDRESS]);

        if (result && result.channelId) {
          channelId = result.channelId as string;
          FeedbackService.setFeedbackChannelId(channelId);
          trackEvent('feedback_submitted', { action: 'channel_created', channel_id: channelId });
        } else {
          return null;
        }
      }
    }

    return channelId;
  }, [createChannel, channels, fetchChannels]);

  // Submit feedback
  const submitFeedback = useCallback(async (
    rating: 'thumbs_up' | 'thumbs_down',
    message?: string
  ) => {
    if (!isReady || !currentAccount) {
      setState(prev => ({
        ...prev,
        error: 'Wallet not connected or messaging not ready',
      }));
      return false;
    }

    setState(prev => ({
      ...prev,
      isSending: true,
      error: null,
    }));

    try {
      // Get or create feedback channel
      const channelId = await getOrCreateFeedbackChannel();

      if (!channelId) {
        throw new Error('Failed to create feedback channel');
      }

      // Format feedback message
      const feedbackMessage = FeedbackService.formatFeedbackMessage(
        rating,
        message,
        currentAccount.address
      );

      // Send feedback message
      const result = await sendMessage(channelId, feedbackMessage);

      if (result) {
        // Mark feedback as sent
        FeedbackService.markFeedbackSent();

        setState(prev => ({
          ...prev,
          isSending: false,
          isOpen: false,
          hasSentFeedback: true,
          showBubble: FeedbackService.getInteractionCount() >= 3 && !FeedbackService.hasOptedOut(),
          error: null,
        }));

        trackEvent('feedback_submitted', {
          rating,
          has_message: !!message ? 1 : 0,
          channel_id: channelId,
        });

        return true;
      } else {
        throw new Error('Failed to send feedback message');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      setState(prev => ({
        ...prev,
        isSending: false,
        error: errorMessage,
      }));

      trackError('feedback_submit', errorMessage);

      return false;
    }
  }, [isReady, currentAccount, getOrCreateFeedbackChannel, sendMessage]);

  return {
    ...state,
    openFeedback,
    closeFeedback,
    submitFeedback,
    handleOptOut,
    trackInteraction,
  };
};