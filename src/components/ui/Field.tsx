import type { ComponentProps, ReactNode } from "react";

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
      {children}
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

export function Input({
  compact = false,
  className,
  ...rest
}: ComponentProps<"input"> & { compact?: boolean }) {
  return (
    <input
      className={`border border-zinc-300 bg-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 ${
        compact ? "rounded-lg px-2 py-1" : "rounded-xl px-3 py-2"
      } text-sm ${className ?? ""}`}
      {...rest}
    />
  );
}

export function Select({ className, ...rest }: ComponentProps<"select">) {
  return (
    <select
      className={`cursor-pointer rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 ${className ?? ""}`}
      {...rest}
    />
  );
}
