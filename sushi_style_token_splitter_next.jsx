import React, { useMemo, useState } from "react";

/**
 * Sushi‑inspired UI that keeps your current Split ETH / Split Tokens flow
 * while giving it a modern glassy look. Pure React + TailwindCSS.
 *
 * Drop this into a Next.js page or component file. Tailwind required.
 * All blockchain actions are exposed as no‑op handlers to wire into your app.
 */

const TOKENS = [
  { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  { symbol: "DAI", name: "Dai", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
  { symbol: "ENS", name: "Ethereum Name Service", address: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72" },
  { symbol: "CUSTOM", name: "Custom", address: "" },
];

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
        active
          ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/30 shadow-[0_0_0_1px_rgba(34,211,238,.25)_inset]"
          : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-slate-400 mb-1 px-1">{children}</div>;
}

export default function TokenSplitterSushiStyle() {
  // High‑level tabs
  const [mode, setMode] = useState<"eth" | "token">("token");
  const [splitKind, setSplitKind] = useState<"equal" | "unequal">("equal");

  // Token + chain state
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [customToken, setCustomToken] = useState("");

  // Faux onchain UI state (replace with your data)
  const [balance, setBalance] = useState("0.00");
  const [allowance, setAllowance] = useState("0.00");
  const [approved, setApproved] = useState(false);

  // Split form state
  const [amountEach, setAmountEach] = useState("");
  const [recipients, setRecipients] = useState("");
  const [unequalCsv, setUnequalCsv] = useState("");

  const tokenAddress = useMemo(() => (selectedToken.symbol === "CUSTOM" ? customToken.trim() : selectedToken.address), [
    selectedToken,
    customToken,
  ]);

  const recipientList = useMemo(() => {
    return recipients
      .split(/\s|,|\n/g)
      .map((r) => r.trim())
      .filter(Boolean);
  }, [recipients]);

  const unequalAmounts = useMemo(() => {
    return unequalCsv
      .split(/\s|,|\n/g)
      .map((v) => v.trim())
      .filter(Boolean);
  }, [unequalCsv]);

  const canSplit = useMemo(() => {
    if (mode === "token" && !approved) return false;
    if (recipientList.length === 0) return false;
    if (splitKind === "equal") return Number(amountEach) > 0;
    return unequalAmounts.length === recipientList.length && unequalAmounts.every((v) => Number(v) > 0);
  }, [mode, approved, recipientList, splitKind, amountEach, unequalAmounts]);

  // —— Wire these into your real handlers ——
  const handleApprove = async () => {
    // TODO: call ERC20 approve
    setApproved(true);
    setAllowance("∞");
  };

  const handleSplit = async () => {
    // TODO: send split transaction(s)
    const payload = {
      mode,
      splitKind,
      tokenAddress,
      amountEach,
      recipients: recipientList,
      unequalAmounts,
    };
    console.log("Split payload", payload);
    alert("Pretend we sent the split! Check console for payload.");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0f14] text-white overflow-hidden">
      {/* Spotlight background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[800px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 h-96 w-[900px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* Header bar (lightweight) */}
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 grid place-items-center rounded-full bg-cyan-500/20 border border-cyan-400/30">⚡</div>
          <div className="font-semibold tracking-wide text-slate-200">DG Token Splitter</div>
        </div>
        <button className="rounded-full px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20">
          Connect Wallet
        </button>
      </div>

      {/* Center card */}
      <div className="mx-auto max-w-xl px-4 pb-20">
        <div className="mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 sm:p-5 shadow-2xl shadow-black/40">
          {/* Title + rate row */}
          <div className="mb-4">
            <div className="text-lg font-semibold text-slate-100">Split</div>
            <div className="text-[11px] text-slate-400 mt-1">Fast token distribution to multiple wallets</div>
          </div>

          {/* Mode / kind pills */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Pill active={mode === "eth"} onClick={() => setMode("eth")}>Split ETH</Pill>
            <Pill active={mode === "token"} onClick={() => setMode("token")}>Split Tokens</Pill>
            <div className="mx-2 h-5 w-px bg-white/10" />
            <Pill active={splitKind === "equal"} onClick={() => setSplitKind("equal")}>Equal Splits</Pill>
            <Pill active={splitKind === "unequal"} onClick={() => setSplitKind("unequal")}>Unequal Splits</Pill>
          </div>

          {/* Token selector + approve (only for token mode) */}
          {mode === "token" && (
            <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3">
              <FieldLabel>Token</FieldLabel>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                    <span className="h-6 w-6 grid place-items-center rounded-full bg-white/10">💠</span>
                    <select
                      className="bg-transparent outline-none text-sm flex-1"
                      value={selectedToken.symbol}
                      onChange={(e) => {
                        const next = TOKENS.find((t) => t.symbol === e.target.value)!;
                        setSelectedToken(next);
                      }}
                    >
                      {TOKENS.map((t) => (
                        <option key={t.symbol} value={t.symbol} className="bg-slate-900">
                          {t.symbol} — {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 whitespace-nowrap">
                  <div>Balance: <span className="text-slate-200">{balance}</span></div>
                  <div>Allowance: <span className="text-slate-200">{allowance}</span></div>
                </div>
              </div>

              {selectedToken.symbol === "CUSTOM" && (
                <div className="mt-3">
                  <FieldLabel>Custom Token Address</FieldLabel>
                  <input
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value)}
                    placeholder="0x…"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              )}

              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleApprove}
                  disabled={approved || !tokenAddress}
                  className={`px-4 py-2 rounded-xl text-sm border transition ${
                    approved
                      ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-200 cursor-default"
                      : "bg-cyan-500/20 border-cyan-400/30 text-cyan-100 hover:bg-cyan-500/30"
                  }`}
                >
                  {approved ? "Approved" : "Approve"}
                </button>
              </div>
            </div>
          )}

          {/* Amount each */}
          {splitKind === "equal" && (
            <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3">
              <FieldLabel>Amount Each {mode === "token" ? `(${selectedToken.symbol})` : "(ETH)"}</FieldLabel>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                <input
                  inputMode="decimal"
                  placeholder="0.0"
                  value={amountEach}
                  onChange={(e) => setAmountEach(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-lg"
                />
                <div className="text-xs text-slate-400">$0.00</div>
              </div>
            </div>
          )}

          {/* Unequal CSV amounts */}
          {splitKind === "unequal" && (
            <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3">
              <FieldLabel>Amounts (CSV — align with recipients)</FieldLabel>
              <textarea
                rows={2}
                placeholder="e.g. 1, 0.5, 2, 0.25"
                value={unequalCsv}
                onChange={(e) => setUnequalCsv(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
              <div className="mt-1 text-[11px] text-slate-400">Use commas, spaces or new lines.</div>
            </div>
          )}

          {/* Recipients */}
          <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-center justify-between">
              <FieldLabel>Recipient Wallets</FieldLabel>
              <button
                className="text-[11px] rounded-full border border-white/10 px-2 py-1 bg-white/5 hover:bg-white/10"
                onClick={() => alert("Hook this into your contacts book.")}
              >
                CONTACTS
              </button>
            </div>
            <textarea
              rows={4}
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="Separate each address with a comma, space or new line"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
            <div className="mt-1 text-[11px] text-slate-400">{recipientList.length} recipient(s)</div>
          </div>

          {/* Primary action */}
          <button
            onClick={handleSplit}
            disabled={!canSplit}
            className={`w-full rounded-xl py-3 text-sm font-medium shadow-lg transition ${
              canSplit
                ? "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-900 hover:opacity-95"
                : "bg-white/10 text-slate-400 cursor-not-allowed"
            }`}
          >
            {mode === "token" ? "Split Tokens" : "Split ETH"}
          </button>

          {/* Foot notes */}
          <div className="mt-3 text-[11px] text-slate-500 text-center">
            Gas optimized. Non‑custodial. You control approvals and transfers.
          </div>
        </div>
      </div>
    </div>
  );
}
