import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import Button from "@/components/ui/Button";
import CategoryIcon from "@/components/ui/CategoryIcon";

export const dynamic = "force-dynamic";

export default async function StorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const storeId = Number(id);
  if (!Number.isInteger(storeId)) notFound();

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      city: true,
      listings: { include: { product: { include: { category: true } } }, orderBy: { priceUnit: "asc" } },
    },
  });
  if (!store) notFound();

  return (
    <div className="flex flex-col gap-8">
      <nav className="text-sm text-zinc-500">
        <Link href="/catalogue" className="hover:text-bf-red">
          Catalogue
        </Link>
        <span className="mx-2">/</span>
        <span>{store.name}</span>
      </nav>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-bf-red">
            {store.type} · {store.city.name}
          </span>
          <h1 className="text-3xl font-extrabold">{store.name}</h1>
          <p className="text-zinc-600">{store.address}</p>
          <p className="mt-1 text-sm text-zinc-500">
            {store.listings.length} produit{store.listings.length > 1 ? "s" : ""} référencé
            {store.listings.length > 1 ? "s" : ""}
          </p>
        </div>
        {store.mapUrl ? (
          <Button
            href={store.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Ouvrir dans Google Maps
          </Button>
        ) : null}
      </div>

      <section>
        <h2 className="mb-3 text-xl font-bold">Produits disponibles</h2>
        {store.listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
            Aucun produit référencé dans ce site pour le moment.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <ul className="divide-y divide-zinc-100">
              {store.listings.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/produit/${l.product.id}`}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-zinc-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                      <CategoryIcon slug={l.product.category.slug} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-zinc-900">
                        {l.product.name}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {l.product.brand ?? "FASOYAAR"} · {l.product.unitLabel}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end">
                      <span className="font-bold">{formatPrice(l.priceUnit)}</span>
                      {l.priceCarton && (
                        <span className="text-xs text-zinc-500">
                          carton {formatPrice(l.priceCarton)}
                          {l.unitsPerCarton ? ` (×${l.unitsPerCarton})` : ""}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
