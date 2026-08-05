import Link from "next/link";
import { ArrowRight, Flag, Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cities = await prisma.city.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { stores: true } } },
  });

  return (
    <div className="flex flex-col gap-10">
      <section className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white/70 px-6 py-12 text-center">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-bf-red via-bf-yellow to-bf-green" />
        <Badge className="border border-bf-red/20 bg-bf-red/5 px-4 py-1.5 text-sm font-semibold text-bf-red">
          <Flag className="h-4 w-4" aria-hidden="true" />
          FASOYAAR, au service du peuple Burkinabè
        </Badge>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Trouvez les sites de vente{" "}
          <span className="text-bf-green">près de vous</span>,{" "}
          <span className="text-bf-red">dans votre ville</span>
        </h1>
        <p className="max-w-xl text-lg text-zinc-600">
          La localisation exacte des supermarchés, marchés et boutiques, avec
          l&apos;itinéraire Google Maps.
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
              href={`/ville/${city.slug}`}
              className="group flex w-full flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-bf-green"
            >
              <span className="flex items-center justify-between">
                <span className="text-lg font-bold text-zinc-900 group-hover:text-bf-green-dark">
                  {city.name}
                </span>
                <ArrowRight
                  className="h-5 w-5 text-bf-red transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
              <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                <Store className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                {city._count.stores} site{city._count.stores > 1 ? "s" : ""} de
                vente
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
            text: "Sélectionnez la ville où vous voulez trouver les sites de vente.",
          },
          {
            step: "2",
            title: "Découvrez les sites",
            text: "Supermarchés, marchés et boutiques recensés, avec leur adresse.",
          },
          {
            step: "3",
            title: "Ouvrez Google Maps",
            text: "L'itinéraire exact jusqu'au site de vente, en un clic.",
          },
        ].map((s, i) => (
          <Card key={s.step} className="p-5">
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
          </Card>
        ))}
      </section>
    </div>
  );
}
