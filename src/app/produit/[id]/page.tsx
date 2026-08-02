import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSelectedCitySlug } from "@/lib/city";
import { categoryEmoji, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true, listings: { include: { store: { include: { city: true } } } } },
  });
  if (!product) notFound();

  const citySlug = await getSelectedCitySlug();

  const listings = [...product.listings].sort(
    (a, b) => a.priceUnit - b.priceUnit
  );

  const mapLink = citySlug
    ? `/carte?ville=${citySlug}&produit=${product.id}`
    : `/carte?produit=${product.id}`;

  return (
    <div className="flex flex-col gap-8">
      <nav className="text-sm text-zinc-500">
        <Link href="/catalogue" className="hover:text-bf-red">
          Catalogue
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-zinc-200 bg-white text-8xl">
          {product.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.photoUrl}
              alt={product.name}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            <span className="drop-shadow">{categoryEmoji(product.category.slug)}</span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-bf-red">
            {product.category.name} · {product.brand ?? "FASOYAAR"}
          </span>
          <h1 className="text-3xl font-extrabold leading-tight">{product.name}</h1>
          <p className="text-sm text-zinc-500">
            Vendu à l&apos;{product.unitLabel}
            {product.listings.length > 0
              ? ` · disponible dans ${product.listings.length} site${product.listings.length > 1 ? "s" : ""}`
              : ""}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <span className="block text-xs text-zinc-500">Prix le plus bas (unité)</span>
              <span className="text-2xl font-extrabold text-bf-red">
                {formatPrice(listings[0]?.priceUnit)}
              </span>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <span className="block text-xs text-zinc-500">Prix le plus bas (carton)</span>
              <span className="text-2xl font-extrabold text-bf-red">
                {formatPrice(listings.reduce<number | null>((min, l) => (l.priceCarton && (min === null || l.priceCarton < min) ? l.priceCarton : min), null))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Sites où ce produit est disponible</h2>
          <Link
            href={mapLink}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-bf-green"
          >
            📍 Voir les localisations
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Site</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3 text-right">Prix unité</th>
                <th className="px-4 py-3 text-right">Prix carton</th>
                <th className="px-4 py-3 text-right">Qté / carton</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
                >
                  <td className="px-4 py-3">
                    <Link href={`/site/${l.store.id}`} className="font-semibold text-zinc-900 hover:text-bf-red">
                      {l.store.name}
                    </Link>
                    <span className="block text-xs text-zinc-500">{l.store.address}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{l.store.city.name}</td>
                  <td className="px-4 py-3 text-right font-bold">{formatPrice(l.priceUnit)}</td>
                  <td className="px-4 py-3 text-right">
                    {l.priceCarton ? formatPrice(l.priceCarton) : <span className="text-zinc-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {l.unitsPerCarton ? (
                      `${l.unitsPerCarton}`
                    ) : (
                      <span className="text-xs italic text-zinc-400">à compléter</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
