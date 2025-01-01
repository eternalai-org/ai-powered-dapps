import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@matterlabs/hardhat-zksync";
import "@nomiclabs/hardhat-solhint";
import "hardhat-deploy";
import "dotenv/config";
import "hardhat-contract-sizer";

let localTestMnemonic =
  "test test test test test test test test test test test junk";
const config: HardhatUserConfig = {
  defaultNetwork: "base_mainnet",
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: { enabled: true, runs: 2000000 },
          viaIR: true,
          evmVersion: "paris",
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: true, runs: 2000000 },
          viaIR: true,
          evmVersion: "paris",
        },
      },
    ],
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: localTestMnemonic,
        accountsBalance: "10000000000000000000000000",
      },
      gas: 100_000_000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 1_000_000_000_000,
    },
    base_mainnet: {
      url: process.env.RPC_URL || "",
      chainId: 8453,
      senderKey: process.env.PRIVATE_KEY,
      promptSchedulerAddress: process.env.PROMPT_SCHEDULER_ADDRESS,
      allowUnlimitedContractSize: true,
      ethNetwork: "https://testnet.runechain.com/rpc", // The Ethereum Web3 RPC URL.
      zksync: false,
      gasPrice: "auto",
    } as any,
    symbiosis_mainnet: {
      url: process.env.RPC_URL || "https://rpc.symbiosis.eternalai.org",
      chainId: 45762,
      senderKey: process.env.PRIVATE_KEY,
      promptSchedulerAddress: process.env.PROMPT_SCHEDULER_ADDRESS,
      allowUnlimitedContractSize: true,
      ethNetwork: "https://testnet.runechain.com/rpc", // The Ethereum Web3 RPC URL.
      zksync: true,
      gasPrice: "auto",
    } as any,
    abstract_testnet: {
      url: process.env.RPC_URL || "https://api.testnet.abs.xyz",
      chainId: 11124,
      senderKey: process.env.PRIVATE_KEY,
      promptSchedulerAddress: process.env.PROMPT_SCHEDULER_ADDRESS,
      allowUnlimitedContractSize: true,
      ethNetwork: "https://testnet.runechain.com/rpc", // The Ethereum Web3 RPC URL.
      zksync: true,
      gasPrice: "auto",
    } as any,
    bittensor_mainnet: {
      url: process.env.RPC_URL || "https://evm-subtensor.eternalai.org",
      chainId: 964,
      senderKey: process.env.PRIVATE_KEY,
      promptSchedulerAddress: process.env.PROMPT_SCHEDULER_ADDRESS,
      allowUnlimitedContractSize: true,
      ethNetwork: "https://testnet.runechain.com/rpc", // The Ethereum Web3 RPC URL.
      zksync: false,
      gasPrice: "auto",
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  paths: {
    sources: "./contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
