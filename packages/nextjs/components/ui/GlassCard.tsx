import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 sm:p-5 shadow-2xl shadow-black/40 ${className}`}
    >
      {children}
    </div>
  );
}
