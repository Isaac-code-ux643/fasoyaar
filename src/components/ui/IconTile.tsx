import type { ReactNode } from "react";

export default function IconTile({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
        className ?? "bg-zinc-100 text-zinc-500"
      }`}
    >
      {children}
    </span>
  );
}
