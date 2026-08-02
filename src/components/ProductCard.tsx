import Link from "next/link";
import { formatPrice } from "@/lib/format";
import CategoryIcon from "@/components/ui/CategoryIcon";
import Badge from "@/components/ui/Badge";

export default function ProductCard({
  id,
  name,
  brand,
  categorySlug,
  minPrice,
  storeCount,
  unitLabel,
  photoUrl,
}: {
  id: number;
  name: string;
  brand: string | null;
  categorySlug: string;
  minPrice: number;
  storeCount: number;
  unitLabel: string;
  photoUrl: string | null;
}) {
  return (
    <Link
      href={`/produit/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:-translate-y-0.5 hover:border-bf-green hover:shadow-lg"
    >
      <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 text-6xl">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <CategoryIcon slug={categorySlug} className="h-16 w-16 text-zinc-300" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-bf-red">
          {brand ?? "FASOYAAR"}
        </span>
        <h3 className="line-clamp-2 font-semibold leading-snug text-zinc-900">{name}</h3>
        <p className="text-xs text-zinc-500">{unitLabel}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="text-lg font-bold text-zinc-900">
            {formatPrice(minPrice)}
          </span>
          <Badge>
            {storeCount} site{storeCount > 1 ? "s" : ""}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
