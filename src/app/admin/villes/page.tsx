import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import { createCity, deleteCity } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Villes" };
export const dynamic = "force-dynamic";

export default async function AdminVillesPage() {
  await requireAdmin();

  const cities = await prisma.city.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { stores: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Villes</h1>
        <AdminNav />
      </div>

      <form action={createCity} className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Nom de la ville</label>
          <input
            name="name"
            required
            placeholder="Ex : Ouagadougou"
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">
            Identifiant (optionnel)
          </label>
          <input
            name="slug"
            placeholder="Ex : ouagadougou"
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-bf-green px-4 py-2 text-sm font-semibold text-white hover:bg-bf-green-dark"
          >
            + Ajouter la ville
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Identifiant</th>
              <th className="px-4 py-3 text-center">Sites</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((c) => (
              <tr key={c.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-semibold">{c.name}</td>
                <td className="px-4 py-3 text-zinc-500">{c.slug}</td>
                <td className="px-4 py-3 text-center">{c._count.stores}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteCity}>
                    <input type="hidden" name="id" value={c.id} />
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
