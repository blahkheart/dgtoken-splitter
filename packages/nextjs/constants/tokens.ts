const TOKENS = [
  { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  { symbol: "DAI", name: "Dai", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
  { symbol: "ENS", name: "Ethereum Name Service", address: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72" },
  { symbol: "CUSTOM", name: "Custom", address: "" },
];

// Default tokens configuration for different chains
const tokens: { [chainId: number]: { contracts: typeof TOKENS } } = {
  1: { contracts: TOKENS }, // Mainnet
  31337: { contracts: TOKENS }, // Local
  11155111: { contracts: TOKENS }, // Sepolia
};

export default tokens;