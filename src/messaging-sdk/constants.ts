import type { MessagingPackageConfig } from './types.js';

export const TESTNET_MESSAGING_PACKAGE_CONFIG = {
	packageId: import.meta.env.VITE_TESTNET_PACKAGE_ID || '0xTBD',
	memberCapType: `${import.meta.env.VITE_TESTNET_PACKAGE_ID || '0xTBD'}::channel::MemberCap`,
	sealApproveContract: {
		packageId: import.meta.env.VITE_TESTNET_SEAL_APPROVE_PACKAGE_ID || '0xTBD',
		module: 'seal_policies',
		functionName: 'seal_approve',
	},
	sealSessionKeyTTLmins: 30,
} satisfies MessagingPackageConfig;

export const MAINNET_MESSAGING_PACKAGE_CONFIG = {
	packageId: import.meta.env.VITE_MAINNET_PACKAGE_ID || '0xTBD',
	memberCapType: `${import.meta.env.VITE_MAINNET_PACKAGE_ID || '0xTBD'}::channel::MemberCap`,
	sealApproveContract: {
		packageId: import.meta.env.VITE_MAINNET_SEAL_APPROVE_PACKAGE_ID || '0xTBD',
		module: 'seal_policies',
		functionName: 'seal_approve',
	},
	sealSessionKeyTTLmins: 30,
} satisfies MessagingPackageConfig;
