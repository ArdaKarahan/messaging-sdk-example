import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Button, IconButton } from "@radix-ui/themes";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { SessionKeyProvider } from "./providers/SessionKeyProvider";
import { MessagingClientProvider } from "./providers/MessagingClientProvider";

import { CreateChannel } from "./components/CreateChannel";
import { ChannelList } from "./components/ChannelList";
import { Channel } from "./components/Channel";
import { useState, useEffect } from "react";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { MessagingStatus } from "./components/MessagingStatus";

function AppContent() {
  const currentAccount = useCurrentAccount();
  const [channelId, setChannelId] = useState<string | null>(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setChannelId(isValidSuiObjectId(hash) ? hash : null);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        align="center"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Flex align="center" gap="2">
          <Heading>Messaging SDK Example</Heading>
          <IconButton
            size="2"
            variant="ghost"
            onClick={() => {
              window.open('https://github.com/MystenLabs/messaging-sdk-example', '_blank');
            }}
          >
            <GitHubLogoIcon width="24" height="24" />
          </IconButton>
        </Flex>

        <Box>
          <Flex gap="2" align="center">
            {currentAccount && (
              <Button
                variant="soft"
                onClick={() => {
                  window.open(`https://faucet.sui.io/?address=${currentAccount.address}`, '_blank');
                }}
              >
                Get Testnet SUI
              </Button>
            )}
            <ConnectButton />
          </Flex>
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
        >
          {currentAccount ? (
            channelId ? (
              <Channel
                channelId={channelId}
                onBack={() => {
                  window.location.hash = '';
                  setChannelId(null);
                }}
              />
            ) : (
              <Flex direction="column" gap="4">
                <MessagingStatus />
                <CreateChannel />
                <ChannelList />
              </Flex>
            )
          ) : (
            <Heading>Please connect your wallet</Heading>
          )}
        </Container>
      </Container>
    </>
  );
}

function App() {
  return (
    <SessionKeyProvider>
      <MessagingClientProvider>
        <AppContent />
      </MessagingClientProvider>
    </SessionKeyProvider>
  );
}

export default App;
