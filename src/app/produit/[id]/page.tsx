import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSelectedCitySlug } from "@/lib/city";
import { formatPrice } from "@/lib/format";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { Table, THead, TH, TR, TD } from "@/components/ui/Table";

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
        <Card className="flex aspect-square items-center justify-center">
          {product.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.photoUrl}
              alt={product.name}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            <CategoryIcon
              slug={product.category.slug}
              className="h-24 w-24 text-zinc-300"
            />
          )}
        </Card>

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
            <Card className="p-4">
              <span className="block text-xs text-zinc-500">Prix le plus bas (unité)</span>
              <span className="text-2xl font-extrabold text-bf-red">
                {formatPrice(listings[0]?.priceUnit)}
              </span>
            </Card>
            <Card className="p-4">
              <span className="block text-xs text-zinc-500">Prix le plus bas (carton)</span>
              <span className="text-2xl font-extrabold text-bf-red">
                {formatPrice(listings.reduce<number | null>((min, l) => (l.priceCarton && (min === null || l.priceCarton < min) ? l.priceCarton : min), null))}
              </span>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Sites où ce produit est disponible</h2>
          <Button href={mapLink} variant="dark">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Voir les localisations
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <THead>
              <tr>
                <TH>Site</TH>
                <TH>Ville</TH>
                <TH className="text-right">Prix unité</TH>
                <TH className="text-right">Prix carton</TH>
                <TH className="text-right">Qté / carton</TH>
              </tr>
            </THead>
            <tbody>
              {listings.map((l) => (
                <TR key={l.id} className="hover:bg-zinc-50">
                  <TD>
                    <Link href={`/site/${l.store.id}`} className="font-semibold text-zinc-900 hover:text-bf-red">
                      {l.store.name}
                    </Link>
                    <span className="block text-xs text-zinc-500">{l.store.address}</span>
                  </TD>
                  <TD className="text-zinc-600">{l.store.city.name}</TD>
                  <TD className="text-right font-bold">{formatPrice(l.priceUnit)}</TD>
                  <TD className="text-right">
                    {l.priceCarton ? formatPrice(l.priceCarton) : <span className="text-zinc-400">—</span>}
                  </TD>
                  <TD className="text-right">
                    {l.unitsPerCarton ? (
                      `${l.unitsPerCarton}`
                    ) : (
                      <span className="text-xs italic text-zinc-400">à compléter</span>
                    )}
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
