const TOKENS = [
  { symbol: "DG", name: "DreadGang", address: "0x4aA47eD29959c7053996d8f7918db01A62D02ee5" },
  { symbol: "UP", name: "UnlockProtocolToken", address: "0xac27fa800955849d6d17cc8952ba9dd6eaa66187" },
  { symbol: "USDC", name: "USD Coin", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" },
  { symbol: "CUSTOM", name: "Custom", address: "" },
];

// Default tokens configuration for different chains
const tokens: { [chainId: number]: { contracts: typeof TOKENS } } = {
  1: { contracts: TOKENS }, // Mainnet
  31337: { contracts: TOKENS }, // Local
  11155111: { contracts: TOKENS }, // Sepolia
};

export default tokens;