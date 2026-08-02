import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSelectedCitySlug } from "@/lib/city";
import { formatPrice } from "@/lib/format";
import MapView, { type MapMarker } from "@/components/MapView";

export const dynamic = "force-dynamic";

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ ville?: string; produit?: string }>;
}) {
  const params = await searchParams;
  const slug = params.ville ?? (await getSelectedCitySlug());
  if (!slug) redirect("/");

  const city = await prisma.city.findUnique({ where: { slug } });
  if (!city) notFound();

  const productId = params.produit ? Number(params.produit) : null;

  let product: Awaited<ReturnType<typeof prisma.product.findUnique>> | null = null;
  if (productId && Number.isInteger(productId)) {
    product = await prisma.product.findUnique({ where: { id: productId } });
  }

  const stores = await prisma.store.findMany({
    where: {
      cityId: city.id,
      ...(product
        ? { listings: { some: { productId: product.id } } }
        : {}),
    },
    include: {
      listings: product ? { where: { productId: product.id } } : true,
    },
    orderBy: { name: "asc" },
  });

  const markers: MapMarker[] = stores.map((s) => ({
    id: s.id,
    name: s.name,
    address: s.address,
    latitude: s.latitude,
    longitude: s.longitude,
    price: product ? s.listings[0]?.priceUnit ?? null : null,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <nav className="text-sm text-zinc-500">
            <Link href="/catalogue" className="hover:text-bf-red">
              Catalogue
            </Link>
            <span className="mx-2">/</span>
            <span>Carte — {city.name}</span>
          </nav>
          <h1 className="mt-1 text-2xl font-extrabold">
            {product ? `${product.name} à ${city.name}` : `Tous les sites à ${city.name}`}
          </h1>
          <p className="text-sm text-zinc-500">
            {stores.length} site{stores.length > 1 ? "s" : ""} affiché{stores.length > 1 ? "s" : ""}
            {product ? " où ce produit est disponible" : ""}. Cliquez sur un marqueur pour plus d&apos;infos.
          </p>
        </div>
      </div>

      <MapView markers={markers} height="h-[480px]" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((s) => (
          <Link
            key={s.id}
            href={`/site/${s.id}`}
            className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-bf-green"
          >
            <span className="text-2xl">🏬</span>
            <div className="min-w-0">
              <span className="block truncate font-semibold text-zinc-900">{s.name}</span>
              <span className="block text-sm text-zinc-500">{s.address}</span>
              {product && s.listings[0] && (
                <span className="mt-1 block text-sm font-bold text-bf-red">
                  {formatPrice(s.listings[0].priceUnit)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
