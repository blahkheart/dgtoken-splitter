import React from "react";

interface PillProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export function Pill({ active, children, onClick }: PillProps) {
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