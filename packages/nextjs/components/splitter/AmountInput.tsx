import React from "react";
import { EtherInput } from "~~/components/scaffold-eth";
import { FieldLabel } from "~~/components/ui";

interface AmountInputProps {
  mode: "eth" | "token";
  splitKind: "equal" | "unequal";
  amountEach: string;
  setAmountEach: (value: string) => void;
  unequalCsv: string;
  setUnequalCsv: (value: string) => void;
  selectedToken?: { symbol: string };
}

export function AmountInput({
  mode,
  splitKind,
  amountEach,
  setAmountEach,
  unequalCsv,
  setUnequalCsv,
  selectedToken,
}: AmountInputProps) {
  if (splitKind === "equal") {
    return (
      <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3">
        <FieldLabel>Amount Each {mode === "token" ? `(${selectedToken?.symbol || "Token"})` : "(ETH)"}</FieldLabel>
        {mode === "token" ? (
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
            <input
              inputMode="decimal"
              placeholder="0.0"
              value={amountEach}
              onChange={e => setAmountEach(e.target.value)}
              className="flex-1 bg-transparent outline-none text-lg text-white"
            />
            <div className="text-xs text-slate-400">$0.00</div>
          </div>
        ) : (
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <EtherInput value={amountEach} onChange={value => setAmountEach(value)} placeholder="0.0" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3">
      <FieldLabel>Amounts (CSV — align with recipients)</FieldLabel>
      <textarea
        rows={2}
        placeholder="e.g. 1, 0.5, 2, 0.25"
        value={unequalCsv}
        onChange={e => setUnequalCsv(e.target.value)}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40 text-white"
      />
      <div className="mt-1 text-[11px] text-slate-400">Use commas, spaces or new lines.</div>
    </div>
  );
}
