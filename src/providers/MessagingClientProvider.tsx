import { createContext, ReactNode, useMemo, useContext } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { SealClient } from '@mysten/seal';
import { MessagingClient, WalrusStorageAdapter } from '../messaging-sdk';
import { useSessionKey } from './SessionKeyProvider';

// Hard-coded Seal server configurations for testnet
const SEAL_SERVERS = [
  '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75',
  '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8',
];

// Hard-coded package configuration
const PACKAGE_ID = '0x857e46acfe15fca0c68be86897b1af542bc686d397c171da48911e797d6c8417';

const MessagingClientContext = createContext<MessagingClient | null>(null);

export const useMessagingClient = (): MessagingClient | null => {
  const ctx = useContext(MessagingClientContext);
  if (ctx === undefined) {
    throw new Error('useMessagingClient must be used within a MessagingClientProvider');
  }
  return ctx;
};

export const MessagingClientProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const suiClient = useSuiClient();
  const { sessionKey } = useSessionKey();

  const messagingClient = useMemo(() => {
    if (!sessionKey) return null;

    try {
      // Create the extended client with SealClient and MessagingClient
      const extendedClient = suiClient
        .$extend(
          SealClient.asClientExtension({
            serverConfigs: SEAL_SERVERS.map((id) => ({
              objectId: id,
              weight: 1,
            })),
          })
        )
        .$extend(
          MessagingClient.experimental_asClientExtension({
            packageConfig: {
              packageId: PACKAGE_ID,
              memberCapType: `${PACKAGE_ID}::member_cap::MemberCap`,
              sealApproveContract: {
                packageId: PACKAGE_ID,
                module: 'seal_policies',
                functionName: 'seal_approve',
              },
              sealSessionKeyTTLmins: 30,
            },
            storage: (client) =>
              new WalrusStorageAdapter(client, {
                publisher: 'https://publisher.walrus-testnet.walrus.space',
                aggregator: 'https://aggregator.testnet.walrus.mirai.cloud',
                epochs: 10,
              }),
            sessionKey,
          })
        );

      return extendedClient.messaging;
    } catch (error) {
      console.error('Failed to create messaging client:', error);
      return null;
    }
  }, [suiClient, sessionKey]);

  return (
    <MessagingClientContext.Provider value={messagingClient}>
      {children}
    </MessagingClientContext.Provider>
  );
};