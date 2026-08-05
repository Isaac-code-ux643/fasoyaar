import Link from "next/link";
import { Star } from "lucide-react";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className ?? ""}>
      <span className="font-semibold text-bf-red">FASO</span>
      <Star
        className="mx-0.5 inline h-3.5 w-3.5 fill-bf-yellow text-bf-yellow"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <span className="font-semibold text-bf-green">YAAR</span>
    </span>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="flex flex-col leading-none">
      <span className="flex items-center gap-0.5 text-xl font-extrabold tracking-tight">
        <span className="text-bf-red">FASO</span>
        <Star
          className="h-4 w-4 fill-bf-yellow text-bf-yellow"
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <span className="text-bf-green">YAAR</span>
      </span>
      <span className="text-[11px] font-medium text-zinc-500">
        Localisateur de sites de vente
      </span>
    </Link>
  );
}
