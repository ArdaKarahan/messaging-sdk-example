import { useEffect, useState } from 'react';
import { Card, Flex, Text, Box, Button, TextField, Badge } from '@radix-ui/themes';
import { useMessaging } from '../hooks/useMessaging';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { formatTimestamp, formatAddress } from '../utils/formatters';

interface ChannelProps {
  channelId: string;
  onBack: () => void;
}

export function Channel({ channelId, onBack }: ChannelProps) {
  const currentAccount = useCurrentAccount();
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || isSendingMessage) {
      return;
    }

    const result = await sendMessage(channelId, messageText);
    if (result) {
      setMessageText(''); // Clear input on success
    }
  };

  const handleLoadMore = () => {
    if (messagesCursor && !isFetchingMessages) {
      fetchMessages(channelId, messagesCursor);
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