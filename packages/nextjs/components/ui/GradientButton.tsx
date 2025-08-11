import React from "react";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function GradientButton({ children, onClick, disabled = false, className = "" }: GradientButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl py-3 text-sm font-medium shadow-lg transition ${
        disabled
          ? "bg-white/10 text-slate-400 cursor-not-allowed"
          : "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-900 hover:opacity-95"
      } ${className}`}
    >
      {children}
    </button>
  );
}