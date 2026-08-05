import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import IconTile from "@/components/ui/IconTile";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = await prisma.city.findUnique({ where: { slug } });
  if (!city) return { title: "Ville introuvable" };
  return { title: `Sites de vente à ${city.name}` };
}

export default async function CitySitesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = await prisma.city.findUnique({
    where: { slug },
    include: { stores: { orderBy: { name: "asc" } } },
  });
  if (!city) notFound();

  const count = city.stores.length;

  return (
    <div className="flex flex-col gap-7">
      <div>
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="hover:text-bf-red">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-700">{city.name}</span>
        </nav>

        <div className="mt-4 flex items-center gap-3">
          <IconTile className="bg-bf-red/10 text-bf-red">
            <Store className="h-5 w-5" aria-hidden="true" />
          </IconTile>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Sites de vente
            </h1>
            <p className="text-sm text-zinc-500">
              {city.name} · {count} site{count > 1 ? "s" : ""} recensé
              {count > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-bf-red via-bf-yellow to-bf-green" />
      </div>

      {count === 0 ? (
        <Card className="p-10 text-center text-zinc-500">
          Aucun site de vente recensé à {city.name} pour le moment.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {city.stores.map((s) =>
            s.mapUrl ? (
              <a
                key={s.id}
                href={s.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-bf-green hover:bg-bf-green/[0.04]"
              >
                <div className="flex items-start gap-3">
                  <IconTile className="bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-bf-green/10 group-hover:text-bf-green">
                    <Store className="h-5 w-5" aria-hidden="true" />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <span className="block font-semibold text-zinc-900 transition-colors group-hover:text-bf-red">
                      {s.name}
                    </span>
                    <span className="mt-1 flex items-start gap-1 text-sm text-zinc-500">
                      <MapPin
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="line-clamp-2">{s.address}</span>
                    </span>
                  </div>
                </div>
                <span className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-3">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                    {s.type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-bf-red">
                    Google Maps
                    <ExternalLink
                      className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </a>
            ) : (
              <Card key={s.id} className="flex flex-col gap-4 p-5">
                <div className="flex items-start gap-3">
                  <IconTile>
                    <Store className="h-5 w-5" aria-hidden="true" />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <span className="block font-semibold text-zinc-900">
                      {s.name}
                    </span>
                    <span className="mt-1 flex items-start gap-1 text-sm text-zinc-500">
                      <MapPin
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="line-clamp-2">{s.address}</span>
                    </span>
                  </div>
                </div>
                <span className="mt-auto self-start rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                  {s.type}
                </span>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}
