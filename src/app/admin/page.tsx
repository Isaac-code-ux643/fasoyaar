import type { Metadata } from "next";
import Link from "next/link";
import { Landmark, Lightbulb, Store } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { logout } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [cities, stores] = await Promise.all([
    prisma.city.count(),
    prisma.store.count(),
  ]);

  const stats = [
    { label: "Villes", value: cities, href: "/admin/villes", Icon: Landmark },
    { label: "Sites de vente", value: stores, href: "/admin/sites", Icon: Store },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Tableau de bord</h1>
          <p className="text-sm text-zinc-500">
            Gérez les villes et les sites de vente.
          </p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="outline">
            Se déconnecter
          </Button>
        </form>
      </div>

      <AdminNav />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-bf-green"
          >
            <s.Icon className="h-6 w-6 text-bf-red" aria-hidden="true" />
            <span className="mt-2 block text-3xl font-extrabold">{s.value}</span>
            <span className="text-sm text-zinc-500">{s.label}</span>
          </Link>
        ))}
      </div>

      <Card className="flex items-start gap-3 border-dashed p-6 text-sm text-zinc-600">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-bf-yellow" aria-hidden="true" />
        <p>
          <strong>Astuce</strong> : ajoutez le lien Google Maps de chaque site
          (bouton « Obtenir l&apos;itinéraire » dans Google Maps) pour que les
          visiteurs puissent s&apos;y rendre directement.
        </p>
      </Card>
    </div>
  );
}
