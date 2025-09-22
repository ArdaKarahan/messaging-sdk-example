# Using the Messaging SDK

This is the source code for the Sui Stack Messaging SDK, copied directly into this project since there's no npm package available yet.

## Quick Start

```typescript
import { MessagingClient, TESTNET_MESSAGING_PACKAGE_CONFIG } from '@messaging-sdk';
import { SuiClient } from '@mysten/sui/client';

// Create a Sui client
const suiClient = new SuiClient({
  url: 'https://fullnode.testnet.sui.io:443'
});

// Initialize the messaging client
const messagingClient = new MessagingClient({
  client: suiClient,
  packageConfig: TESTNET_MESSAGING_PACKAGE_CONFIG,
});
```

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

- `VITE_TESTNET_PACKAGE_ID` - The package ID for testnet
- `VITE_TESTNET_SEAL_APPROVE_PACKAGE_ID` - The seal approve package ID for testnet
- `VITE_MAINNET_PACKAGE_ID` - The package ID for mainnet
- `VITE_MAINNET_SEAL_APPROVE_PACKAGE_ID` - The seal approve package ID for mainnet

## Important Notes

1. The SDK uses `.js` extensions in imports even for TypeScript files. This is handled by the Vite configuration.
2. Environment variables have been converted from `process.env.X` to `import.meta.env.VITE_X` for Vite compatibility.
3. The SDK is aliased as `@messaging-sdk` in the Vite config for easier imports.