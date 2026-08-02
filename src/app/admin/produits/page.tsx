import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import { categoryEmoji } from "@/lib/format";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
} from "@/app/admin/actions";

export const metadata: Metadata = { title: "Produits" };
export const dynamic = "force-dynamic";

export default async function AdminProduitsPage() {
  await requireAdmin();

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      include: { category: true, _count: { select: { listings: true } } },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Produits</h1>
        <AdminNav />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          action={createProduct}
          className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5"
        >
          <h2 className="font-semibold">➕ Ajouter un produit</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Catégorie</label>
              <select
                name="categoryId"
                required
                className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {categoryEmoji(c.slug)} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Marque</label>
              <input
                name="brand"
                placeholder="Ex : Sovita"
                className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">Nom du produit</label>
            <input
              name="name"
              required
              placeholder="Ex : Huile végétale (1L)"
              className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Unité de vente</label>
              <input
                name="unitLabel"
                placeholder="Ex : bouteille de 1 L"
                className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">
                Photo (URL)
              </label>
              <input
                name="photoUrl"
                placeholder="https://… (optionnel)"
                className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-1 rounded-xl bg-bf-green px-4 py-2 text-sm font-semibold text-white hover:bg-bf-green-dark"
          >
            + Ajouter
          </button>
        </form>

        <form
          action={createCategory}
          className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5"
        >
          <h2 className="font-semibold">🏷️ Ajouter une catégorie</h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">
              Nom de la catégorie
            </label>
            <input
              name="name"
              required
              placeholder="Ex : Électroménager"
              className="rounded-xl border border-zinc-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            + Ajouter la catégorie
          </button>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c.id}
                className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-sm"
              >
                {categoryEmoji(c.slug)} {c.name}
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    title="Supprimer"
                    className="font-bold text-zinc-400 hover:text-bf-red"
                  >
                    ×
                  </button>
                </form>
              </span>
            ))}
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Unité</th>
              <th className="px-4 py-3 text-center">Prix</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/produit/${p.id}`} className="font-semibold hover:text-bf-red">
                    {categoryEmoji(p.category.slug)} {p.name}
                  </Link>
                  {p.brand && (
                    <span className="block text-xs text-zinc-500">{p.brand}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600">{p.category.name}</td>
                <td className="px-4 py-3 text-zinc-500">{p.unitLabel}</td>
                <td className="px-4 py-3 text-center">{p._count.listings}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
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
