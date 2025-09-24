# Sui Stack Messaging SDK Example App

This app showcases the new Sui Stack Messaging SDK. The SDK provides a complete, end-to-end encrypted messaging solutions powered by Sui, Walrus, and Seal. The SDK enables developers to integrate secure, wallet-linked messaging directly into apps without building custom backends. These conversations are private by default, recoverable across devices, and composable with other applications. 

Visit the [SDK's repo](https://github.com/MystenLabs/sui-stack-messaging-sdk/tree/main) for more details on the features, use cases, and non-goals. 

## See the SDK in Action
You can try out a live deployment of this site at [https://chatty.wal.app](https://chatty.wal.app)

## Run It Locally
Follow the steps below to run the website locally. 

1. Clone the [repo](https://github.com/MystenLabs/messaging-sdk-example)
2. In the root directory, install the dependencies by running `pnpm install`
3. Start up the local server by running `pnpm dev` and visit the site outputted in your terminal

## How to Build It
Follow the steps below to learn how to build this site from scratch. 

### Step 0: Set up your environment
The starting point for this app is the Mysten Lab's counter example app. Navigate to the directory you want to build this app in and run `pnpm create @mysten/dapp`
  
1. Choose the `react-e2e-counter` option
2. Input whatever you want to call this app 
3. Once built, navigate to the root directory of the app (it should be called whatever your input was in the previous step)

### Step 1: Import the SDKs
The SDK's npm package is still in the process of being publish so the SDK needs to be manually installed. Visit the [SDK's Installation Guide](https://github.com/MystenLabs/sui-stack-messaging-sdk/blob/main/Installation.md) for instructions on how to install the SDK. 

### Step 2: Set up the app's contexts

#### Set up contexts for handling the user's session
The SDK uses Seal for encrypting messages and attachments. The Seal SDK requires a `SessionKey`, which contains a signature from the connected account and allows the app to retrieve the Seal decryption keys for a limited time without requiring repeated user confirmations. Visit the [Seal docs](https://seal-docs.wal.app/Design/#user-confirmation-and-sessions) for more details on Seal sessions. 

Once an account is connected, the app requests a signature from the user that will be used to generate the `SessionKey` for the session. The session in this app lasts 30 minutes. The `SessionKey` is stored in the browser's local storage to persist the `SessionKey` through refreshes (as long as the 30 minute window hasn't expired).

This is all handled in the [`SessionKeyProvider.tsx` component](./src/providers/SessionKeyProvider.tsx). The status is displayed on the app with the [`MessagingStatus` component](./src/components/MessagingStatus.tsx).

#### Set up the messaging context
Create a provider that creates a Seal + Messaging client using the connected account and the previously generated `SessionKey`. Visit the [Messaging SDK docs](https://github.com/MystenLabs/sui-stack-messaging-sdk/blob/main/Setup.md#complete-extension-example) to get more details on creating the complete client. 

This is managed in [`MessagingClientProvider.tsx`](./src/providers/MessagingClientProvider.tsx).

#### Set up the messaging hook
This app uses a single [`useMessaging.ts`](./src/hooks/useMessaging.ts) hook that holds all of the functionality and state for listing `Channels`, creating `Channels`, receiving and sending messages, and other details. 

### Step 3: Set up the app's user interface

#### Creating channels
The primary structure in the Messaging SDK are `Channels`. `Channels` are the core messaging containers in this SDK - encrypted communication spaces between users on the Sui blockchain. Think of them as secure, decentralized chat rooms with strong access control and end-to-end encryption. `Channels` hold membership details, messages, along with other details. Visit the [`Channel` source code](https://github.com/MystenLabs/sui-stack-messaging-sdk/blob/16614887129706864562a7684b006bb193c0fcc7/move/sui_stack_messaging/sources/channel.move#L29) for the full structure. 

The Messaging SDK provides `createChannelFlow` to facilitate the process of creating a new `Channel`. Creating a `Channel` is a multi-step process that involves creating the on-chain `Channel` object, generating and distributing the `CreatorCap` and `MemberCap`s, and generating and attaching the encryption key. Visit the [`createChannelFlow` API reference](https://github.com/MystenLabs/sui-stack-messaging-sdk/blob/main/APIRef.md#createchannelflowopts-createchannelflowopts-createchannelflow) for more details. Note that [`executeCreateChannelTransaction`](https://github.com/MystenLabs/sui-stack-messaging-sdk/blob/main/APIRef.md#executecreatechanneltransactionparams-promise-digest-channelid-creatorcapid-encryptedkeybytes-) is useful if you are creating channels in a server, i.e. when you have direct access to the `Signer`. 

The UI for creating a `Channel` is in the [`CreateChannel` component](./src/components/CreateChannel.tsx).

#### Listing channels
This app uses `getChannelObjectsByAddress` to fetch and list all of the `Channels` or *chat rooms* that the connected user is in. This `getChannelObjectsByAddress` function works by fetching all of the `MemberCaps` that the user has and retrieves the `Channel` data for each membership. Visit the [`getChannelObjectsByAddress` API reference](https://github.com/MystenLabs/sui-stack-messaging-sdk/blob/main/APIRef.md#getchannelobjectsbyaddressrequest-channelmembershipsrequest-promisedecryptedchannelobjectsbyaddressresponse) for more details. 

The UI for listing `Channel`s is in the [`ChannelList` component](./src/components/ChannelList.tsx).

#### Receiving and sending messages
This app uses [`getChannelObjectsByChannelIds`](https://github.com/MystenLabs/sui-stack-messaging-sdk/blob/main/APIRef.md#getchannelobjectsbychannelidsrequest-getchannelobjectsbychannelidsrequest-promisedecryptedchannelobject) to fetch the details for specific `Channel`s, [`getChannelMessages`](https://github.com/MystenLabs/sui-stack-messaging-sdk/blob/main/APIRef.md#getchannelmessagesrequest-getchannelmessagesrequest-promisedecryptedmessagesresponse) to retrieve all of the messages in the `Channel`, and [`sendMessage`](https://github.com/MystenLabs/sui-stack-messaging-sdk/blob/main/APIRef.md#sendmessagechannelid-membercapid-sender-message-encryptedkey-attachments-promisetx-transaction--promisevoid) to send new messages. 

The UI for displaying a `Channel` and send messages is in the [`Channel` component](./src/components/Channel.tsx).
## Resources
- [`SDK GitHub Repository](https://github.com/MystenLabs/sui-stack-messaging-sdk)
- [`SDK API Reference](https://github.com/MystenLabs/sui-stack-messaging-sdk/blob/main/APIRef.md)


## Help, I'm stuck!
[Join the discord](https://discord.gg/sS893zcPMN) to ask questions about the example app and the SDK! 