export const FEEDBACK_RECIPIENT_ADDRESS = '0xcad6934633aeda60f7195ddbc6e09420b1d40713c3dc3bbb8afbb5dec4b82a95';

export interface FeedbackMessage {
  type: 'feedback';
  rating: 'thumbs_up' | 'thumbs_down';
  message?: string;
  timestamp: number;
  userAddress: string;
  appVersion: string;
}

export class FeedbackService {
  private static FEEDBACK_CHANNEL_KEY = 'feedback_channel_id';
  private static FEEDBACK_SENT_KEY = 'feedback_sent';
  private static FEEDBACK_OPT_OUT_KEY = 'feedback_opt_out';
  private static FEEDBACK_CARD_SHOWN_KEY = 'feedback_card_shown';
  private static INTERACTION_COUNT_KEY = 'interaction_count';
  private static INTERACTION_THRESHOLD = 3; // Show feedback after 3 interactions

  static getFeedbackChannelId(): string | null {
    return localStorage.getItem(this.FEEDBACK_CHANNEL_KEY);
  }

  static setFeedbackChannelId(channelId: string): void {
    localStorage.setItem(this.FEEDBACK_CHANNEL_KEY, channelId);
  }

  static hasSentFeedback(): boolean {
    return localStorage.getItem(this.FEEDBACK_SENT_KEY) === 'true';
  }

  static markFeedbackSent(): void {
    localStorage.setItem(this.FEEDBACK_SENT_KEY, 'true');
    this.resetInteractionCount();
  }

  static hasOptedOut(): boolean {
    return localStorage.getItem(this.FEEDBACK_OPT_OUT_KEY) === 'true';
  }

  static setOptOut(optOut: boolean): void {
    localStorage.setItem(this.FEEDBACK_OPT_OUT_KEY, optOut.toString());
  }

  static hasShownCard(): boolean {
    return localStorage.getItem(this.FEEDBACK_CARD_SHOWN_KEY) === 'true';
  }

  static markCardShown(): void {
    localStorage.setItem(this.FEEDBACK_CARD_SHOWN_KEY, 'true');
  }

  static getInteractionCount(): number {
    const count = localStorage.getItem(this.INTERACTION_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  }

  static incrementInteractionCount(): void {
    const current = this.getInteractionCount();
    localStorage.setItem(this.INTERACTION_COUNT_KEY, (current + 1).toString());
  }

  static resetInteractionCount(): void {
    localStorage.setItem(this.INTERACTION_COUNT_KEY, '0');
  }

  static shouldShowFeedback(): boolean {
    // Don't show if user opted out or already shown the card automatically
    if (this.hasOptedOut() || this.hasShownCard()) {
      return false;
    }
    // Show if interaction threshold is reached
    return this.getInteractionCount() >= this.INTERACTION_THRESHOLD;
  }

  static formatFeedbackMessage(
    rating: 'thumbs_up' | 'thumbs_down',
    message: string | undefined,
    userAddress: string
  ): string {
    const feedbackData: FeedbackMessage = {
      type: 'feedback',
      rating,
      message,
      timestamp: Date.now(),
      userAddress,
      appVersion: '0.0.0', // You might want to get this from package.json
    };
    return JSON.stringify(feedbackData, null, 2);
  }
}