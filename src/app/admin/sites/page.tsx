import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import { createStore, deleteStore } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Sites" };
export const dynamic = "force-dynamic";

export default async function AdminSitesPage() {
  await requireAdmin();

  const [cities, stores] = await Promise.all([
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.store.findMany({
      orderBy: [{ cityId: "asc" }, { name: "asc" }],
      include: { city: true, _count: { select: { listings: true } } },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Sites (magasins)</h1>
        <AdminNav />
      </div>

      <form
        action={createStore}
        className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Ville</label>
          <select
            name="cityId"
            required
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Type</label>
          <select
            name="type"
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
          >
            <option>Supermarché</option>
            <option>Marché</option>
            <option>Boutique</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Nom du site</label>
          <input
            name="name"
            required
            placeholder="Ex : FASOYAAR Ouaga 2000"
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Adresse</label>
          <input
            name="address"
            required
            placeholder="Ex : Zone du Bois"
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">
              Latitude (GPS)
            </label>
            <input
              name="latitude"
              required
              type="number"
              step="any"
              placeholder="12.3671"
              className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">
              Longitude (GPS)
            </label>
            <input
              name="longitude"
              required
              type="number"
              step="any"
              placeholder="-1.5146"
              className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-bf-green px-4 py-2 text-sm font-semibold text-white hover:bg-bf-green-dark"
          >
            + Ajouter le site
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Site</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Coordonnées</th>
              <th className="px-4 py-3 text-center">Produits</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/site/${s.id}`} className="font-semibold hover:text-bf-red">
                    {s.name}
                  </Link>
                  <span className="block text-xs text-zinc-500">{s.address}</span>
                </td>
                <td className="px-4 py-3 text-zinc-600">{s.city.name}</td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                </td>
                <td className="px-4 py-3 text-center">{s._count.listings}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteStore}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
