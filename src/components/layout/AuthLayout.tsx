// src/components/layout/AuthLayout.tsx
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-slate-900/80 p-8 shadow-xl ring-1 ring-slate-800">
        <h1 className="mb-1 text-xl font-semibold text-white">{title}</h1>
        {subtitle && (
          <p className="mb-6 text-xs text-slate-400">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}
