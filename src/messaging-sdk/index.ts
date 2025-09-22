// Main exports from the messaging SDK
export { SuiStackMessagingClient as MessagingClient } from './client.js';
export {
  TESTNET_MESSAGING_PACKAGE_CONFIG,
  MAINNET_MESSAGING_PACKAGE_CONFIG
} from './constants.js';
export { MessagingClientError } from './error.js';

// Type exports
export type {
  MessagingClientOptions,
  MessagingPackageConfig,
  ParsedChannelObject,
  ParsedMessageObject,
  DecryptMessageResult,
  LazyDecryptAttachmentResult,
  GetChannelMessagesRequest,
  DecryptedChannelObject,
  DecryptedMessagesResponse,
  DecryptedChannelObjectsByAddressResponse,
  GetChannelObjectsByChannelIdsRequest,
  ChannelMembershipsRequest,
  ChannelMembershipsResponse,
  ChannelMembersResponse,
  ChannelMember,
  CreateChannelFlow,
  CreateChannelFlowGetGeneratedCapsOpts,
  CreateChannelFlowOpts,
  GetLatestMessagesRequest,
  MessagingClientExtensionOptions,
  MessagingCompatibleClient,
} from './types.js';

// Storage exports
export { WalrusStorageAdapter } from './storage/adapters/walrus/walrus.js';
export type { StorageAdapter } from './storage/adapters/storage.js';

// Encryption exports
export { EnvelopeEncryption } from './encryption/envelopeEncryption.js';
export type { EncryptedSymmetricKey } from './encryption/types.js';