import { IconButton } from '@radix-ui/themes';
import { ChatBubbleIcon } from '@radix-ui/react-icons';

interface FeedbackBubbleProps {
  onClick: () => void;
  isVisible: boolean;
}

export function FeedbackBubble({ onClick, isVisible }: FeedbackBubbleProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <IconButton
      size="3"
      variant="solid"
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 999,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        animation: 'pulseScale 2s ease-in-out infinite',
      }}
      title="Give Feedback"
    >
      <ChatBubbleIcon width="20" height="20" />
      <style>{`
        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </IconButton>
  );
}