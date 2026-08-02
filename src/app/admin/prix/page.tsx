import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import { createListing, deleteListing, updateListing } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Prix" };
export const dynamic = "force-dynamic";

export default async function AdminPrixPage() {
  await requireAdmin();

  const [products, cities, listings] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" }, include: { category: true } }),
    prisma.city.findMany({ orderBy: { name: "asc" }, include: { stores: { orderBy: { name: "asc" } } } }),
    prisma.listing.findMany({
      orderBy: { updatedAt: "desc" },
      include: { product: { include: { category: true } }, store: true },
      take: 200,
    }),
  ]);

  const inputCls =
    "w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Prix</h1>
        <AdminNav />
      </div>

      <form
        action={createListing}
        className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Produit</label>
          <select name="productId" required className={inputCls}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category.name})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Site</label>
          <select name="storeId" required className={inputCls}>
            {cities.map((c) => (
              <optgroup key={c.id} label={c.name}>
                {c.stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Prix unitaire (FCFA)</label>
          <input name="priceUnit" required type="number" min="1" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">Prix carton</label>
            <input name="priceCarton" type="number" min="1" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">Qté / carton</label>
            <input name="unitsPerCarton" type="number" min="1" className={inputCls} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-bf-green px-4 py-2 text-sm font-semibold text-white hover:bg-bf-green-dark"
          >
            + Ajouter / mettre à jour le prix
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Site</th>
              <th className="px-4 py-3">Unité (F)</th>
              <th className="px-4 py-3">Carton (F)</th>
              <th className="px-4 py-3">Qté/carton</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-zinc-100 align-middle last:border-0">
                <td className="px-4 py-3">
                  <span className="font-semibold">{l.product.name}</span>
                  <span className="block text-xs text-zinc-500">
                    {l.product.category.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600">{l.store.name}</td>
                <td className="px-4 py-3">
                  <input
                    form={`edit-${l.id}`}
                    name="priceUnit"
                    type="number"
                    min="1"
                    defaultValue={l.priceUnit}
                    className="w-28 rounded-lg border border-zinc-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    form={`edit-${l.id}`}
                    name="priceCarton"
                    type="number"
                    min="1"
                    defaultValue={l.priceCarton ?? ""}
                    placeholder="—"
                    className="w-28 rounded-lg border border-zinc-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    form={`edit-${l.id}`}
                    name="unitsPerCarton"
                    type="number"
                    min="1"
                    defaultValue={l.unitsPerCarton ?? ""}
                    placeholder="—"
                    className="w-20 rounded-lg border border-zinc-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <form id={`edit-${l.id}`} action={updateListing}>
                      <input type="hidden" name="id" value={l.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-700"
                      >
                        Enregistrer
                      </button>
                    </form>
                    <form action={deleteListing}>
                      <input type="hidden" name="id" value={l.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
