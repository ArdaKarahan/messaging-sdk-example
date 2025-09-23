import { useMessaging } from '../hooks/useMessaging';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Box, Card, Text, Badge, Flex, Separator } from '@radix-ui/themes';

export function MessagingStatus() {
  const currentAccount = useCurrentAccount();
  const { client, sessionKey, isInitializing, error, isReady } = useMessaging();

  return (
    <Card mb="4">
      <Flex direction="column" gap="3">
        <Box>
          <Text size="5" weight="bold">Messaging SDK Status</Text>
        </Box>

        <Separator size="4" />

        <Flex direction="column" gap="2">
          <Flex justify="between">
            <Text>Current Account:</Text>
            <Badge color={currentAccount ? 'green' : 'gray'}>
              {currentAccount?.address ?
                `${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}` :
                'Not connected'}
            </Badge>
          </Flex>

          <Flex justify="between">
            <Text>Session Key:</Text>
            <Badge color={sessionKey ? 'green' : isInitializing ? 'yellow' : 'gray'}>
              {isInitializing ? 'Initializing...' : sessionKey ? 'Active' : 'Not initialized'}
            </Badge>
          </Flex>

          <Flex justify="between">
            <Text>Messaging Client:</Text>
            <Badge color={client ? 'green' : 'gray'}>
              {client ? 'Ready' : 'Not initialized'}
            </Badge>
          </Flex>

          <Flex justify="between">
            <Text>Overall Status:</Text>
            <Badge color={isReady ? 'green' : isInitializing ? 'yellow' : 'red'}>
              {isReady ? 'Ready to use' : isInitializing ? 'Setting up...' : 'Not ready'}
            </Badge>
          </Flex>
        </Flex>

        {error && (
          <>
            <Separator size="4" />
            <Box>
              <Text color="red" size="2">Error: {error.message}</Text>
            </Box>
          </>
        )}


        {isReady && (
          <>
            <Separator size="4" />
            <Box>
              <Text size="3" color="green">
                ✓ Messaging client is ready! You can now use it to send and receive messages.
              </Text>
            </Box>
          </>
        )}
      </Flex>
    </Card>
  );
}