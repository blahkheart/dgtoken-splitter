"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useState } from "react";
import { Pill } from "~~/components/ui";
import { SplitterForm } from "~~/components/splitter";

const Home: NextPage = () => {
  // High‑level tabs
  const [mode, setMode] = useState<"eth" | "token">("token");
  const [splitKind, setSplitKind] = useState<"equal" | "unequal">("equal");
  const account = useAccount();

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white overflow-x-hidden">
      {/* Spotlight background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-80 w-[800px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-96 w-[900px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* Navigation pills - positioned below fixed header */}
      <div className="relative z-10 pt-24 pb-6">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Pill active={mode === "eth"} onClick={() => setMode("eth")}>Split ETH</Pill>
            <Pill active={mode === "token"} onClick={() => setMode("token")}>Split Tokens</Pill>
            <div className="mx-2 h-5 w-px bg-white/10" />
            <Pill active={splitKind === "equal"} onClick={() => setSplitKind("equal")}>Equal Splits</Pill>
            <Pill active={splitKind === "unequal"} onClick={() => setSplitKind("unequal")}>Unequal Splits</Pill>
          </div>
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 mx-auto max-w-xl px-4 pt-4 pb-24">
        {/* Main form */}
        <SplitterForm mode={mode} splitKind={splitKind} />
      </div>
    </div>
  );
};

export default Home;

