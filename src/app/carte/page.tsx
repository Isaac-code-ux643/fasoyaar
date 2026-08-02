import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MapPin, Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSelectedCitySlug } from "@/lib/city";
import { formatPrice } from "@/lib/format";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

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
            {product ? " où ce produit est disponible" : ""}. Ouvrez le lien Google Maps pour y voir l&apos;itinéraire.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((s) => (
          <Card key={s.id} className="flex items-start gap-3 p-4">
            <Store className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <Link
                href={`/site/${s.id}`}
                className="block truncate font-semibold text-zinc-900 hover:text-bf-red"
              >
                {s.name}
              </Link>
              <span className="block text-sm text-zinc-500">{s.address}</span>
              {product && s.listings[0] && (
                <span className="mt-1 block text-sm font-bold text-bf-red">
                  {formatPrice(s.listings[0].priceUnit)}
                </span>
              )}
              {s.mapUrl && (
                <Button
                  href={s.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="dark"
                  size="sm"
                  className="mt-2"
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  Ouvrir dans Google Maps
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
