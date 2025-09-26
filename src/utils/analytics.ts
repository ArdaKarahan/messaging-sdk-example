declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: {
        callback?: () => void;
        props?: Record<string, string | number>;
        revenue?: {
          amount: number;
          currency?: string;
        };
      }
    ) => void;
  }
}

export const trackEvent = (
  eventName: string,
  props?: Record<string, string | number>,
  callback?: () => void
) => {
  if (typeof window !== 'undefined' && window.plausible) {
    try {
      window.plausible(eventName, {
        props,
        callback,
      });
    } catch (error) {
      console.error('Failed to track event:', eventName, error);
    }
  }
};

export const trackError = (
  errorType: string,
  errorMessage: string,
  context?: Record<string, string | number>
) => {
  trackEvent(`error_${errorType}`, {
    message: errorMessage.slice(0, 100),
    ...context,
  });
};

export const AnalyticsEvents = {
  WALLET_CONNECTED: 'wallet_connected',
  WALLET_DISCONNECTED: 'wallet_disconnected',
  CHANNEL_CREATED: 'channel_created',
  CHANNEL_OPENED: 'channel_opened',
  CHANNEL_LIST_REFRESHED: 'channel_list_refreshed',
  MESSAGE_SENT: 'message_sent',
  MESSAGES_LOADED_MORE: 'messages_loaded_more',
  GITHUB_CLICKED: 'github_clicked',
  DISCORD_CLICKED: 'discord_clicked',
  FAUCET_CLICKED: 'faucet_clicked',
  CHANNEL_ERROR: 'channel_error',
  MESSAGE_ERROR: 'message_error',
  FEEDBACK_SHOWN: 'feedback_shown',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  FEEDBACK_DISMISSED: 'feedback_dismissed',
  FEEDBACK_OPT_OUT: 'feedback_opt_out',
} as const;