import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
      {children}
    </thead>
  );
}

export function TR({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <tr className={`border-b border-zinc-100 last:border-0 ${className ?? ""}`}>
      {children}
    </tr>
  );
}

export function TH({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <th className={`px-4 py-3 ${className ?? ""}`}>{children}</th>;
}

export function TD({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <td className={`px-4 py-3 ${className ?? ""}`}>{children}</td>;
}
