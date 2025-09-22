import { Card, Flex, Text, Box, Separator, Badge, Button } from '@radix-ui/themes';
import { useMessaging } from '../hooks/useMessaging';
import { useEffect } from 'react';

export function ChannelList() {
  const { channels, isFetchingChannels, fetchChannels, isReady } = useMessaging();

  useEffect(() => {
    console.log('Channels updated:', channels);
  }, [channels]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            Your Channels
          </Text>
          <Button
            size="2"
            variant="soft"
            onClick={fetchChannels}
            disabled={isFetchingChannels || !isReady}
          >
            {isFetchingChannels ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Flex>

        <Separator size="4" />

        {!isReady ? (
          <Text size="2" color="gray">
            Waiting for messaging client to initialize...
          </Text>
        ) : isFetchingChannels && channels.length === 0 ? (
          <Text size="2" color="gray">
            Loading channels...
          </Text>
        ) : channels.length === 0 ? (
          <Box py="4">
            <Text size="2" color="gray">
              No channels yet. Create one above to start messaging!
            </Text>
          </Box>
        ) : (
          <Flex direction="column" gap="2">
            {channels.map((channel) => (
              <Box
                key={channel.id.id}
                p="3"
                onClick={() => {
                  window.location.hash = channel.id.id;
                }}
                style={{
                  backgroundColor: 'var(--gray-a2)',
                  borderRadius: 'var(--radius-2)',
                  border: '1px solid var(--gray-a3)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-a4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-a2)';
                }}
              >
                <Flex direction="column" gap="2">
                  <Flex justify="between" align="start">
                    <Box>
                      <Text size="2" weight="bold">
                        Channel ID
                      </Text>
                      <Text size="1" color="gray" style={{ display: 'block' }}>
                        {channel.id.id.slice(0, 16)}...{channel.id.id.slice(-4)}
                      </Text>
                    </Box>
                    <Badge color="green" size="1">
                      Active
                    </Badge>
                  </Flex>

                  <Flex gap="4">
                    <Box>
                      <Text size="1" color="gray">
                        Messages
                      </Text>
                      <Text size="2" weight="medium" style={{ display: 'block' }}>
                        {channel.messages_count}
                      </Text>
                    </Box>

                    <Box>
                      <Text size="1" color="gray">
                        Members
                      </Text>
                      <Text size="2" weight="medium" style={{ display: 'block' }}>
                        {/* {channel.member_count} */}
                      </Text>
                    </Box>

                    <Box>
                      <Text size="1" color="gray">
                        Created
                      </Text>
                      <Text size="2" weight="medium" style={{ display: 'block' }}>
                        {channel.created_at_ms}
                      </Text>
                    </Box>
                  </Flex>

                  {channel.last_message && (
                    <>
                      <Separator size="4" />
                      <Box>
                        <Text size="1" color="gray">
                          Last Message
                        </Text>
                        <Text size="2" style={{ display: 'block', marginTop: '4px' }}>
                          {channel.last_message.text.length > 50
                            ? `${channel.last_message.text.slice(0, 50)}...`
                            : channel.last_message.text}
                        </Text>
                        <Text size="1" color="gray">
                          {channel.updated_at_ms}
                        </Text>
                      </Box>
                    </>
                  )}
                </Flex>
              </Box>
            ))}
          </Flex>
        )}

        {channels.length > 0 && (
          <>
            <Separator size="4" />
            <Text size="1" color="gray">
              Auto-refreshes every 10 seconds • {channels.length} channel{channels.length !== 1 ? 's' : ''}
            </Text>
          </>
        )}
      </Flex>
    </Card>
  );
}