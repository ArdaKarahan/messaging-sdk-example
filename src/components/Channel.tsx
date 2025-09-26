import { useEffect, useState, useRef } from 'react';
import { Card, Flex, Text, Box, Button, TextField, Badge } from '@radix-ui/themes';
import { useMessaging } from '../hooks/useMessaging';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { formatTimestamp, formatAddress } from '../utils/formatters';
import { trackEvent, trackError, AnalyticsEvents } from '../utils/analytics';

interface ChannelProps {
  channelId: string;
  onBack: () => void;
  onInteraction?: () => void;
}

export function Channel({ channelId, onBack, onInteraction }: ChannelProps) {
  const currentAccount = useCurrentAccount();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoadingOlderRef = useRef(false);
  const {
    currentChannel,
    messages,
    getChannelById,
    fetchMessages,
    sendMessage,
    isFetchingMessages,
    isSendingMessage,
    messagesCursor,
    hasMoreMessages,
    channelError,
    isReady,
  } = useMessaging();

  const [messageText, setMessageText] = useState('');

  // Fetch channel and messages on mount
  useEffect(() => {
    if (isReady && channelId) {
      // Track channel open event
      trackEvent(AnalyticsEvents.CHANNEL_OPENED, {
        channel_id: channelId,
      });

      getChannelById(channelId).then(() => {
        fetchMessages(channelId);
      });

      // Auto-refresh messages every 10 seconds
      const interval = setInterval(() => {
        fetchMessages(channelId);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isReady, channelId, getChannelById, fetchMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    // Don't scroll if we're loading older messages
    if (!isLoadingOlderRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    // Reset the flag after messages update
    isLoadingOlderRef.current = false;
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || isSendingMessage) {
      return;
    }

    const result = await sendMessage(channelId, messageText);
    if (result) {
      setMessageText(''); // Clear input on success
      // Track successful message send
      trackEvent(AnalyticsEvents.MESSAGE_SENT, {
        channel_id: channelId,
        message_length: messageText.length,
      });
      // Track interaction for feedback
      if (onInteraction) {
        onInteraction();
      }
    } else if (channelError) {
      // Track message sending error
      trackError('message_send', channelError, {
        channel_id: channelId,
      });
    }
  };

  const handleLoadMore = () => {
    if (messagesCursor && !isFetchingMessages) {
      isLoadingOlderRef.current = true;
      fetchMessages(channelId, messagesCursor);
      // Track loading more messages
      trackEvent(AnalyticsEvents.MESSAGES_LOADED_MORE, {
        channel_id: channelId,
      });
    }
  };

  if (!isReady) {
    return (
      <Card>
        <Text size="2" color="gray">
          Waiting for messaging client to initialize...
        </Text>
      </Card>
    );
  }

  return (
    <Card style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box p="3" style={{ borderBottom: '1px solid var(--gray-a3)' }}>
        <Flex justify="between" align="center">
          <Flex gap="3" align="center">
            <Button size="2" variant="soft" onClick={onBack}>
              ← Back
            </Button>
            <Box>
              <Text size="3" weight="bold">Channel</Text>
              {currentChannel && (
                <Text size="1" color="gray" style={{ display: 'block' }}>
                  {formatAddress(currentChannel.id.id)}
                </Text>
              )}
            </Box>
          </Flex>
          {currentChannel && (
            <Flex gap="2">
              <Badge color="green" size="1">
                {currentChannel.messages_count} messages
              </Badge>
            </Flex>
          )}
        </Flex>
      </Box>

      {/* Messages Area */}
      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Load More Button */}
        {hasMoreMessages && (
          <Box style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Button
              size="2"
              variant="soft"
              onClick={handleLoadMore}
              disabled={isFetchingMessages}
            >
              {isFetchingMessages ? 'Loading...' : 'Load older messages'}
            </Button>
          </Box>
        )}

        {/* Messages */}
        {messages.length === 0 && !isFetchingMessages ? (
          <Box style={{ textAlign: 'center', padding: '32px' }}>
            <Text size="2" color="gray">
              No messages yet. Start the conversation!
            </Text>
          </Box>
        ) : (
          <Flex direction="column" gap="2">
            {messages.map((message, index) => {
              const isOwnMessage = message.sender === currentAccount?.address;
              return (
                <Box
                  key={index}
                  style={{
                    alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                  }}
                >
                  <Box
                    p="3"
                    style={{
                      backgroundColor: isOwnMessage ? 'var(--accent-a3)' : 'var(--gray-a3)',
                      borderRadius: 'var(--radius-2)',
                    }}
                  >
                    <Flex direction="column" gap="1">
                      <Text size="1" color="gray">
                        {isOwnMessage ? 'You' : formatAddress(message.sender)}
                      </Text>
                      <Text size="2">{message.text}</Text>
                      <Text size="1" color="gray">
                        {formatTimestamp(message.createdAtMs)}
                      </Text>
                    </Flex>
                  </Box>
                </Box>
              );
            })}
          </Flex>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />

        {isFetchingMessages && messages.length === 0 && (
          <Box style={{ textAlign: 'center', padding: '32px' }}>
            <Text size="2" color="gray">Loading messages...</Text>
          </Box>
        )}
      </Box>

      {/* Error Display */}
      {channelError && (
        <Box p="3" style={{ borderTop: '1px solid var(--gray-a3)' }}>
          <Text size="2" color="red">
            Error: {channelError}
          </Text>
        </Box>
      )}

      {/* Message Input */}
      <Box p="3" style={{ borderTop: '1px solid var(--gray-a3)' }}>
        <form onSubmit={handleSendMessage}>
          <Flex gap="2">
            <TextField.Root
              size="3"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={isSendingMessage || !isReady}
              style={{ flex: 1 }}
            />
            <Button
              size="3"
              type="submit"
              disabled={!messageText.trim() || isSendingMessage || !isReady}
            >
              {isSendingMessage ? 'Sending...' : 'Send'}
            </Button>
          </Flex>
        </form>
      </Box>
    </Card>
  );
}