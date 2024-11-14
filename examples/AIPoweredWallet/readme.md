```markdown
# AI Powered Wallet - Suspicious Transaction Detection

This project demonstrates an AI-powered wallet designed to detect suspicious transactions using a pre-trained model.

## Getting Started

Follow these steps to set up and run the project:

### Step 1: Environment Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required environment variables within the `.env` file.  Ensure all placeholders are replaced with appropriate values, paying close attention to network-specific configurations (e.g., RPC endpoints, contract addresses).


### Step 2: Dependency Installation

Install the project dependencies using npm:

```bash
npm install
```

### Step 3: Smart Contract Compilation

Compile the smart contracts using Hardhat:

```bash
npx hardhat compile
```

### Step 4: Contract Deployment

You can either deploy a new `AIPoweredWallet` contract or use a previously deployed instance.

**Deploy a new contract:**

```bash
npm run deploy:base_mainnet
```

After successful deployment, copy the newly deployed `AIPoweredWallet` contract address and update the `BASE_MAINNET_AI_POWERED_WALLET_ADDRESS` variable in your `.env` file.


**Using an existing deployed contract:**

If you are using an already deployed contract, ensure the `BASE_MAINNET_AI_POWERED_WALLET_ADDRESS` in your `.env` file points to the correct address.


### Step 5: Testing Suspicious Transaction Detection

Run the following script to test the suspicious transaction detection functionality:

```bash
npm run suspiciousTransaction:base_mainnet
```

This script will interact with the deployed `AIPoweredWallet` contract and demonstrate how the AI model is used to flag potentially suspicious transactions.