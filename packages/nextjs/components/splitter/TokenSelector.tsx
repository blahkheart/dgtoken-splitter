import React, { useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { Spinner } from "~~/components/Spinner";
import { FieldLabel } from "~~/components/ui";
import tokens from "~~/constants/tokens";
import { useApproveForSplitting } from "~~/hooks/useApproveForSplitting";


interface TokenSelectorProps {
  tokenContract: string;
  setTokenContract: (address: string) => void;
  splitErc20Loading?: boolean;
}

const TOKENS = [
  { symbol: "DG", name: "DreadGang", address: "0x4aA47eD29959c7053996d8f7918db01A62D02ee5" },
  { symbol: "UP", name: "UnlockProtocolToken", address: "0xac27fa800955849d6d17cc8952ba9dd6eaa66187" },
  { symbol: "USDC", name: "USD Coin", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" },
  { symbol: "CUSTOM", name: "Custom", address: "" },
];

export function TokenSelector({ tokenContract, setTokenContract, splitErc20Loading }: TokenSelectorProps) {
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [customToken, setCustomToken] = useState("");
  const [approveAmount] = useState<string>("10000000");
  
  const chainId = useChainId();

  const tokenAddress = useMemo(() => {
    return selectedToken.symbol === "CUSTOM" ? customToken.trim() : selectedToken.address;
  }, [selectedToken, customToken]);

  const {
    allowance,
    writeAsync: approve,
    balance,
    tokenSymbol,
    isLoading: dataLoading,
  } = useApproveForSplitting({
    tokenAddress: tokenContract,
    amount: Number(approveAmount),
    isTransferLoading: splitErc20Loading || false,
  });

  const approved = allowance !== "0.00" && allowance !== "0" && allowance !== undefined;

  const handleApprove = async () => {
    await approve();
  };

  React.useEffect(() => {
    if (tokenAddress) {
      setTokenContract(tokenAddress);
    }
  }, [tokenAddress, setTokenContract]);

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3">
      <FieldLabel>Token</FieldLabel>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
            <span className="h-6 w-6 grid place-items-center rounded-full bg-white/10">💠</span>
            <select
              className="bg-transparent outline-none text-sm flex-1 text-white"
              value={selectedToken.symbol}
              onChange={(e) => {
                const next = TOKENS.find((t) => t.symbol === e.target.value)!;
                setSelectedToken(next);
              }}
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-slate-900 text-white">
                  {t.symbol} — {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-right text-xs text-slate-400 whitespace-nowrap">
          <div>Balance: <span className="text-slate-200">{balance?.toFixed(4) || "0.00"}</span></div>
          <div>Allowance: <span className="text-slate-200">{allowance || "0.00"}</span></div>
        </div>
      </div>

      {selectedToken.symbol === "CUSTOM" && (
        <div className="mt-3">
          <FieldLabel>Custom Token Address</FieldLabel>
          <input
            value={customToken}
            onChange={(e) => setCustomToken(e.target.value)}
            placeholder="0x…"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40 text-white"
          />
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleApprove}
          disabled={approved || !tokenAddress || dataLoading}
          className={`px-4 py-2 rounded-xl text-sm border transition flex items-center gap-2 ${
            approved
              ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-200 cursor-default"
              : "bg-cyan-500/20 border-cyan-400/30 text-cyan-100 hover:bg-cyan-500/30 disabled:opacity-50"
          }`}
        >
          {dataLoading && <Spinner />}
          {approved ? "Approved" : "Approve"}
        </button>
      </div>
    </div>
  );
}