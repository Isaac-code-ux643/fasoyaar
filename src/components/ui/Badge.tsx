import type { ReactNode } from "react";

export default function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        className ?? "bg-zinc-100 text-zinc-600"
      }`}
    >
      {children}
    </span>
  );
}
