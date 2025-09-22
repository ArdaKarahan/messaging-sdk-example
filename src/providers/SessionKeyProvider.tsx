import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useCurrentAccount, useSignPersonalMessage, useSuiClient } from '@mysten/dapp-kit';
import { SessionKey } from '@mysten/seal';

interface SessionKeyContextProps {
  sessionKey: SessionKey | null;
  isInitializing: boolean;
  error: Error | null;
}

const SessionKeyContext = createContext<SessionKeyContextProps | undefined>(undefined);

export const SessionKeyProvider = ({ children }: { children: ReactNode }) => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

  const [sessionKey, setSessionKey] = useState<SessionKey | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeSessionKey = async () => {
      if (!currentAccount?.address) {
        setSessionKey(null);
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        // Create a new session key
        const newSessionKey = await SessionKey.create({
          address: currentAccount.address,
          packageId: '0x857e46acfe15fca0c68be86897b1af542bc686d397c171da48911e797d6c8417',
          ttlMin: 30, // 30 minutes TTL
          suiClient,
        });

        // Sign the personal message
        const message = await signPersonalMessage({
          message: newSessionKey.getPersonalMessage(),
        });

        // Set the signature on the session key
        await newSessionKey.setPersonalMessageSignature(message.signature);

        setSessionKey(newSessionKey);
      } catch (err) {
        console.error('Error initializing session key:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize session key'));
        setSessionKey(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSessionKey();
  }, [currentAccount?.address, suiClient, signPersonalMessage]);

  return (
    <SessionKeyContext.Provider value={{ sessionKey, isInitializing, error }}>
      {children}
    </SessionKeyContext.Provider>
  );
};

export const useSessionKey = () => {
  const context = useContext(SessionKeyContext);
  if (context === undefined) {
    throw new Error('useSessionKey must be used within a SessionKeyProvider');
  }
  return context;
};