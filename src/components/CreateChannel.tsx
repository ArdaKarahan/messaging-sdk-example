import { useState } from 'react';
import { Card, Flex, Text, TextField, Button, Separator, Box } from '@radix-ui/themes';
import { useMessaging } from '../hooks/useMessaging';
import { isValidSuiAddress } from '@mysten/sui/utils';

export function CreateChannel() {
  const { createChannel, isCreatingChannel, channelError, isReady } = useMessaging();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    // Validate address
    if (!recipientAddress.trim()) {
      setValidationError('Please enter a recipient address');
      return;
    }

    if (!isValidSuiAddress(recipientAddress)) {
      setValidationError('Invalid Sui address');
      return;
    }

    // Create channel
    const result = await createChannel(recipientAddress);

    if (result?.channelId) {
      setSuccessMessage(`Channel created successfully! ID: ${result.channelId.slice(0, 10)}...`);
      setRecipientAddress(''); // Clear input on success

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  return (
    <Card mb="4">
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="3">
          <Box>
            <Text size="4" weight="bold">Create New Channel</Text>
          </Box>

          <Separator size="4" />

          <Box>
            <Text size="2" color="gray">
              Enter a Sui address to create a private messaging channel with that user.
            </Text>
          </Box>

          <TextField.Root
            size="3"
            placeholder="Enter recipient's Sui address (0x...)"
            value={recipientAddress}
            onChange={(e) => {
              setRecipientAddress(e.target.value);
              setValidationError(null);
            }}
            disabled={!isReady || isCreatingChannel}
          />

          {validationError && (
            <Text size="2" color="red">
              {validationError}
            </Text>
          )}

          {channelError && (
            <Text size="2" color="red">
              Error: {channelError}
            </Text>
          )}

          {successMessage && (
            <Text size="2" color="green">
              {successMessage}
            </Text>
          )}

          <Button
            size="3"
            disabled={!isReady || isCreatingChannel}
            type="submit"
          >
            {isCreatingChannel ? 'Creating Channel...' : 'Create Channel'}
          </Button>

          {!isReady && (
            <Text size="2" color="gray">
              Waiting for messaging client to initialize...
            </Text>
          )}
        </Flex>
      </form>
    </Card>
  );
}