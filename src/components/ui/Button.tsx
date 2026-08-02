import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "dark" | "outline" | "danger" | "ghost";
type Size = "sm" | "md" | "pill";

const base =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 transition-colors disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "rounded-xl bg-bf-green text-white hover:bg-bf-green-dark",
  dark: "rounded-full bg-zinc-900 text-white hover:bg-bf-green",
  outline:
    "rounded-full border border-zinc-300 bg-white text-zinc-700 hover:border-bf-green hover:text-bf-red",
  danger: "rounded-lg border border-red-200 text-red-600 hover:bg-red-50",
  ghost: "rounded-full",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1 text-xs font-semibold",
  md: "px-4 py-2 text-sm font-semibold",
  pill: "px-4 py-1.5 text-sm font-medium",
};

export default function Button({
  href,
  target,
  rel,
  variant = "primary",
  size = "md",
  active = false,
  activeVariant = "green",
  className,
  children,
  ...rest
}: ComponentProps<"button"> & {
  href?: string;
  target?: string;
  rel?: string;
  variant?: Variant;
  size?: Size;
  active?: boolean;
  activeVariant?: "green" | "dark";
  children?: ReactNode;
}) {
  const ghostState =
    variant === "ghost"
      ? active
        ? activeVariant === "dark"
          ? "bg-zinc-900 text-white"
          : "bg-bf-green text-white"
        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
      : "";

  const cls = [base, variants[variant], sizes[size], ghostState, className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
