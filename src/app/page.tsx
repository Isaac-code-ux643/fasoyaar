import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cities = await prisma.city.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { stores: true } } },
  });

  const stats = await Promise.all(
    cities.map(async (c) => {
      const products = await prisma.listing.findMany({
        where: { store: { cityId: c.id } },
        select: { productId: true },
        distinct: ["productId"],
      });
      return { cityId: c.id, products: products.length };
    })
  );
  const statMap = new Map(stats.map((s) => [s.cityId, s.products]));

  return (
    <div className="flex flex-col gap-10">
      <section className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white/70 px-6 py-12 text-center shadow-sm backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-bf-red via-bf-yellow to-bf-green" />
        <span className="rounded-full border border-bf-red/20 bg-bf-red/5 px-4 py-1.5 text-sm font-semibold text-bf-red">
          🇧🇫 FASOYAAR, au service du peuple Burkinabè
        </span>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Trouvez le produit et le prix{" "}
          <span className="text-bf-green">juste</span> dans{" "}
          <span className="text-bf-red">votre ville</span>
        </h1>
        <p className="max-w-xl text-lg text-zinc-600">
          Prix unitaire, prix carton, et la localisation exacte de tous les sites
          où le produit est disponible.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-bf-green-dark">
          Choisissez votre ville
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/api/ville/${city.slug}`}
              className="group flex w-full flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-bf-green hover:shadow-lg"
            >
              <span className="flex items-center justify-between">
                <span className="text-lg font-bold text-zinc-900 group-hover:text-bf-green-dark">
                  {city.name}
                </span>
                <span className="text-2xl text-bf-red transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
              <span className="text-sm text-zinc-500">
                {city._count.stores} site{city._count.stores > 1 ? "s" : ""} ·{" "}
                {statMap.get(city.id) ?? 0} produit
                {(statMap.get(city.id) ?? 0) > 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            step: "1",
            title: "Choisissez votre ville",
            text: "Sélectionnez la ville où vous voulez comparer les prix.",
          },
          {
            step: "2",
            title: "Trouvez votre produit",
            text: "Prix unitaire et prix carton, photo et unité, par produit.",
          },
          {
            step: "3",
            title: "Localisez les sites",
            text: "La carte vous montre l'emplacement exact de tous les sites où il est disponible.",
          },
        ].map((s, i) => (
          <div
            key={s.step}
            className="rounded-2xl border border-zinc-200 bg-white p-5"
          >
            <span
              className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                i === 0
                  ? "bg-bf-red"
                  : i === 1
                    ? "bg-bf-yellow text-zinc-900"
                    : "bg-bf-green"
              }`}
            >
              {s.step}
            </span>
            <h3 className="font-semibold text-zinc-900">{s.title}</h3>
            <p className="text-sm text-zinc-600">{s.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
