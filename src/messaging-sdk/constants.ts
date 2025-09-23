import type { MessagingPackageConfig } from './types.js';

export const TESTNET_MESSAGING_PACKAGE_CONFIG = {
	packageId: "0x857e46acfe15fca0c68be86897b1af542bc686d397c171da48911e797d6c8417",
	memberCapType: `0x857e46acfe15fca0c68be86897b1af542bc686d397c171da48911e797d6c8417::channel::MemberCap`,
	sealApproveContract: {
		packageId: "0x857e46acfe15fca0c68be86897b1af542bc686d397c171da48911e797d6c8417",
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
