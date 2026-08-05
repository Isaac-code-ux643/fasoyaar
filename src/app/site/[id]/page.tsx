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
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const store = await prisma.store.findUnique({
    where: { id: Number(id) },
    include: { city: true },
  });
  if (!store) return { title: "Site introuvable" };
  return { title: `${store.name} — ${store.city.name}` };
}

export default async function SitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const storeId = Number(id);
  if (!Number.isInteger(storeId)) notFound();

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: { city: true },
  });
  if (!store) notFound();

  return (
    <div className="flex flex-col gap-6">
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="hover:text-bf-red">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/ville/${store.city.slug}`} className="hover:text-bf-red">
          {store.city.name}
        </Link>
        <span className="mx-2">/</span>
        <span>{store.name}</span>
      </nav>

      <Card className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-bf-red/10">
            <Store className="h-6 w-6 text-bf-red" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">{store.name}</h1>
            <p className="mt-1 text-zinc-600">{store.address}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
              <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
                {store.type}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
                {store.city.name}
              </span>
            </div>
          </div>
        </div>

        {store.mapUrl && (
          <Button
            href={store.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            className="shrink-0"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Ouvrir dans Google Maps
          </Button>
        )}
      </Card>

      <Card className="flex items-start gap-3 p-6 text-sm text-zinc-600">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-bf-red" aria-hidden="true" />
        <p>
          Ce site de vente est recensé par FASOYAAR. Cliquez sur le bouton
          Google Maps pour obtenir l&apos;itinéraire exact jusqu&apos;à{" "}
          {store.name}.
        </p>
      </Card>
    </div>
  );
}
