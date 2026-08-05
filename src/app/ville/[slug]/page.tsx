import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="hover:text-bf-red">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span>Sites de vente — {city.name}</span>
        </nav>
        <h1 className="mt-1 text-3xl font-extrabold">
          Sites de vente à {city.name}
        </h1>
        <p className="text-sm text-zinc-500">
          {city.stores.length} site{city.stores.length > 1 ? "s" : ""} recensé
          {city.stores.length > 1 ? "s" : ""}. Cliquez sur le lien Google Maps
          pour voir l&apos;itinéraire.
        </p>
      </div>

      {city.stores.length === 0 ? (
        <Card className="p-10 text-center text-zinc-500">
          Aucun site de vente recensé à {city.name} pour le moment.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {city.stores.map((s) => (
            <Card key={s.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-start gap-3">
                <Store
                  className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/site/${s.id}`}
                    className="block truncate font-semibold text-zinc-900 hover:text-bf-red"
                  >
                    {s.name}
                  </Link>
                  <span className="block text-sm text-zinc-500">{s.address}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                  {s.type}
                </span>
                {s.mapUrl && (
                  <Button
                    href={s.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="dark"
                    size="sm"
                  >
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Google Maps
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
