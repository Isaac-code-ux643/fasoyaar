import Link from "next/link";
import { ArrowRight, Landmark, MapPin, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Flag from "@/components/ui/Flag";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cities, siteCount] = await Promise.all([
    prisma.city.findMany({
      orderBy: { name: "asc" },
      select: {
        slug: true,
        name: true,
        _count: { select: { stores: true } },
      },
    }),
    prisma.store.count(),
  ]);

  const stats = [
    { value: cities.length, label: "Villes couvertes" },
    { value: siteCount, label: "Sites de vente recensés" },
    { value: "100 %", label: "Gratuit et ouvert" },
  ];

  return (
    <section className="mx-auto grid w-full max-w-5xl items-center gap-10 py-8 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      <div className="order-1 lg:order-2">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/90 shadow-sm backdrop-blur">
          <div className="h-1.5 w-full bg-gradient-to-r from-bf-red via-bf-yellow to-bf-green" />
          <div className="p-6 sm:p-7">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700">
              <MapPin className="h-4 w-4 text-bf-red" aria-hidden="true" />
              Vous êtes dans quelle ville ?
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              {cities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/api/ville/${c.slug}`}
                  className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3.5 transition-colors hover:border-bf-green hover:bg-bf-green/[0.04]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-bf-green/10 group-hover:text-bf-green">
                    <Landmark className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate font-semibold text-zinc-900">
                      {c.name}
                    </span>
                    <span className="block text-xs text-zinc-500">
                      {c._count.stores} site{c._count.stores > 1 ? "s" : ""} de
                      vente
                    </span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-zinc-300 transition-all group-hover:translate-x-1 group-hover:text-bf-red"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-zinc-400">
              Le lien s&apos;ouvre directement dans Google Maps.
            </p>
          </div>
        </div>
      </div>

      <div className="order-2 flex flex-col items-center gap-6 text-center lg:order-1 lg:items-start lg:text-left">
        <span className="inline-flex items-center gap-2 rounded-full border border-bf-green/25 bg-bf-green/[0.07] px-3.5 py-1.5 text-xs font-semibold text-bf-green-dark">
          <Flag className="h-4 w-auto" />
          Au service du peuple Burkinabè
        </span>

        <div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            <span className="text-bf-red">FASO</span>
            <Star
              className="mx-1.5 inline h-9 w-9 fill-bf-yellow text-bf-yellow sm:h-11 sm:w-11"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-bf-green">YAAR</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-zinc-600 lg:mx-0">
            Le localisateur des sites de vente au Burkina Faso. Trouvez le
            magasin le plus proche de chez vous et ouvrez l&apos;itinéraire en
            un clic.
          </p>
        </div>

        <dl className="grid w-full max-w-md grid-cols-3 gap-3 lg:max-w-none">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 backdrop-blur"
            >
              <dt className="text-2xl font-extrabold text-zinc-900">
                {s.value}
              </dt>
              <dd className="mt-0.5 text-xs leading-tight text-zinc-500">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>

        <p className="flex items-center gap-1.5 text-sm text-zinc-500">
          <MapPin className="h-4 w-4 text-bf-red" aria-hidden="true" />
          Sélectionnez votre ville ci-contre pour commencer.
        </p>
      </div>
    </section>
  );
}
