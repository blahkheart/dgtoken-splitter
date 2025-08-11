# DG Token Splitter

DG Token Splitter is a smart contract and Next.js application built with [Scaffold ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) for distributing Ethereum (ETH) or ERC20 tokens to multiple recipients. It supports both equal and custom amount distributions with gas-optimized operations.

**Disclaimer:** This contract is a prototype and intended for research and
development purposes only. Use it at your own discretion.

## Content

- [Quickstart](#quickstart)
- [Features](#features)
- [Usage](#usage)
- [Functions](#functions)
  - [`splitETH`](#spliteth)
  - [`splitEqualETH`](#splitequaleth)
  - [`splitERC20`](#spliterc20)
  - [`splitEqualERC20`](#splitequalerc20)
  - [`withdraw`](#withdraw)
- [Events](#events)
- [Modifiers](#modifiers)
- [Frontend](#frontend)
- [Contributing](#contributing)

## Quickstart

To get started with DG Token Splitter, follow the steps below:

Clone this repo & install dependencies

```bash
git clone https://github.com/dgtoken-splitter/dgtoken-splitter.git
cd dgtoken-splitter
yarn install
```

Run a local network in the first terminal:

```bash
yarn chain
```

On a second terminal, deploy the contract:

```bash
yarn deploy
```

On a third terminal, start your Next.js app:

```bash
yarn start
```

Visit `http://localhost:3000` to see the application.

## Features

- Split ETH among multiple recipients based on specified amounts.
- Split ETH equally among multiple recipients.
- Split ERC20 tokens among multiple recipients based on specified amounts.
- Split ERC20 tokens equally among multiple recipients.
- Withdraw remaining ETH or ERC20 tokens to the contract owner.

## Usage

1. Deploy the DGTokenSplitter contract.
2. Call the appropriate function to split ETH or ERC20 tokens among recipients.
3. Recipients will receive their allocated amounts.
4. The contract owner can withdraw any remaining ETH or ERC20 tokens.

## Functions

### `splitETH`

```solidity
function splitETH(address payable[] calldata recipients, uint256[] calldata amounts) external payable nonReentrant
```

This function splits the provided ETH among the given recipients according to
the specified amounts.

- `recipients`: An array of payable addresses representing the recipients of the
  ETH.
- `amounts`: An array of uint256 values specifying the amounts each recipient
  shall receive.

### `splitEqualETH`

```solidity
function splitEqualETH(address payable[] calldata recipients) external payable nonReentrant
```

This function splits the provided ETH equally among the given recipients.

- `recipients`: An array of payable addresses representing the recipients of the
  ETH.

### `splitERC20`

```solidity
function splitERC20(IERC20 token, address[] calldata recipients, uint256[] calldata amounts) external nonReentrant
```

This function splits the provided ERC20 tokens among the given recipients
according to the specified amounts.

- `token`: The ERC20 token contract address.
- `recipients`: An array of addresses representing the recipients of the ERC20
  tokens.
- `amounts`: An array of uint256 values specifying the amounts each recipient
  shall receive.

### `splitEqualERC20`

```solidity
function splitEqualERC20(IERC20 token, address[] calldata recipients, uint256 totalAmount) external nonReentrant
```

This function splits the provided ERC20 tokens equally among the given
recipients.

- `token`: The ERC20 token contract address.
- `recipients`: An array of addresses representing the recipients of the ERC20
  tokens.
- `totalAmount`: The total amount of ERC20 tokens to be distributed equally.

### `withdraw`

```solidity
function withdraw(IERC20 token) external onlyOwner
```

This function allows the contract owner to withdraw any remaining ETH or ERC20
tokens from the contract.

## Events

The contract emits the following events:

- `EthSplit`: Indicates the successful splitting of ETH among recipients.
- `EthSplitEqual`: Indicates the successful equal splitting of ETH among
  recipients.
- `Erc20Split`: Indicates the successful splitting of ERC20 tokens among
  recipients.
- `Erc20SplitEqual`: Indicates the successful equal splitting of ERC20 tokens
  among recipients.

## Modifiers

- `onlyOwner`: Ensures that only the contract owner can perform certain actions.

## Frontend

The frontend is built using Next.js with a modern glass-morphism UI, providing an intuitive interface to interact with the smart contract.

### Features

- **Split ETH**: Distribute Ether equally or with custom amounts
- **Split Tokens**: Distribute ERC20 tokens with built-in approval flow
- **ENS Support**: Resolve ENS names for recipient addresses
- **Contact Management**: Save and reuse recipient lists
- **Gas Optimized**: Efficient batch operations for multiple recipients

### Usage

1. Connect your Ethereum wallet using RainbowKit
2. Select split mode: **Split ETH** or **Split Tokens**
3. Choose distribution type: **Equal Splits** or **Unequal Splits**
4. For token splits: Select token and approve spending
5. Enter recipient addresses (comma or line-separated)
6. Specify amounts and execute the transaction

## Contributing

1. Fork the repository and create a new branch for your feature or bug fix.
2. Make the necessary changes and ensure the code follows the project's style guidelines.
3. Write tests for any new functionality.
4. Commit your changes and push them to your forked repository.
5. Submit a pull request, describing your changes in detail and referencing any relevant issues.

Built with [Scaffold ETH 2](https://github.com/scaffold-eth/scaffold-eth-2)
