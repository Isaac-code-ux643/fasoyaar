import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSelectedCitySlug } from "@/lib/city";
import CatalogueControls from "@/components/CatalogueControls";
import ProductCard from "@/components/ProductCard";
import Card from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const slug = await getSelectedCitySlug();
  if (!slug) redirect("/");

  const city = await prisma.city.findUnique({ where: { slug } });
  if (!city) notFound();

  const { q, cat } = await searchParams;
  const query = (q ?? "").trim();

  const where: Record<string, unknown> = {};
  if (cat) where.category = { slug: cat };
  if (query) where.name = { contains: query };

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
  });

  const listings = await prisma.listing.findMany({
    where: {
      productId: { in: products.map((p) => p.id) },
      store: { cityId: city.id },
    },
    include: { store: true },
    orderBy: { priceUnit: "asc" },
  });

  const byProduct = new Map<
    number,
    { minPrice: number; count: number }
  >();
  for (const l of listings) {
    const cur = byProduct.get(l.productId);
    if (!cur) {
      byProduct.set(l.productId, { minPrice: l.priceUnit, count: 1 });
    } else {
      cur.minPrice = Math.min(cur.minPrice, l.priceUnit);
      cur.count += 1;
    }
  }

  const available = products.filter((p) => byProduct.has(p.id));
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold">Catalogue — {city.name}</h1>
          <p className="text-sm text-zinc-500">
            Prix les plus bas constatés sur les sites de la ville.
          </p>
        </div>
      </div>

      <Suspense>
        <CatalogueControls
          categories={categories}
          activeCategory={cat ?? null}
          query={query}
          total={available.length}
        />
      </Suspense>

      {available.length === 0 ? (
        <Card className="p-10 text-center text-zinc-500">
          Aucun produit trouvé dans {city.name} pour cette recherche.
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {available.map((p) => {
            const s = byProduct.get(p.id)!;
            return (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                brand={p.brand}
                categorySlug={p.category.slug}
                minPrice={s.minPrice}
                storeCount={s.count}
                unitLabel={p.unitLabel}
                photoUrl={p.photoUrl}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
