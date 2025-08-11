import React from "react";

interface FieldLabelProps {
  children: React.ReactNode;
}

export function FieldLabel({ children }: FieldLabelProps) {
  return <div className="text-xs text-slate-400 mb-1 px-1">{children}</div>;
}