import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Tag, X } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { Field, Input, Select } from "@/components/ui/Field";
import { Table, THead, TH, TR, TD } from "@/components/ui/Table";
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
        <Card className="p-5">
          <form action={createProduct} className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 font-semibold">
              <Plus className="h-4 w-4 text-bf-red" aria-hidden="true" />
              Ajouter un produit
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Catégorie">
                <Select name="categoryId" required>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Marque">
                <Input name="brand" placeholder="Ex : Sovita" />
              </Field>
            </div>
            <Field label="Nom du produit">
              <Input name="name" required placeholder="Ex : Huile végétale (1L)" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Unité de vente">
                <Input name="unitLabel" placeholder="Ex : bouteille de 1 L" />
              </Field>
              <Field label="Photo (URL)">
                <Input name="photoUrl" placeholder="https://… (optionnel)" />
              </Field>
            </div>
            <Button type="submit" className="mt-1 self-start">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter
            </Button>
          </form>
        </Card>

        <Card className="flex flex-col gap-4 p-5">
          <form action={createCategory} className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 font-semibold">
              <Tag className="h-4 w-4 text-bf-red" aria-hidden="true" />
              Ajouter une catégorie
            </h2>
            <Field label="Nom de la catégorie">
              <Input name="name" required placeholder="Ex : Électroménager" />
            </Field>
            <Button type="submit" variant="dark" className="self-start">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter la catégorie
            </Button>
          </form>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c.id}
                className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-sm"
              >
                <CategoryIcon slug={c.slug} className="h-4 w-4 text-zinc-500" />
                {c.name}
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    title="Supprimer"
                    aria-label={`Supprimer ${c.name}`}
                    className="rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-bf-red"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </form>
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Table>
        <THead>
          <tr>
            <TH>Produit</TH>
            <TH>Catégorie</TH>
            <TH>Unité</TH>
            <TH className="text-center">Prix</TH>
            <TH className="text-right">Actions</TH>
          </tr>
        </THead>
        <tbody>
          {products.map((p) => (
            <TR key={p.id}>
              <TD>
                <Link href={`/produit/${p.id}`} className="flex items-center gap-2 font-semibold hover:text-bf-red">
                  <CategoryIcon slug={p.category.slug} className="h-4 w-4 text-zinc-400" />
                  <span>{p.name}</span>
                </Link>
                {p.brand && (
                  <span className="block text-xs text-zinc-500">{p.brand}</span>
                )}
              </TD>
              <TD className="text-zinc-600">{p.category.name}</TD>
              <TD className="text-zinc-500">{p.unitLabel}</TD>
              <TD className="text-center">{p._count.listings}</TD>
              <TD className="text-right">
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <Button type="submit" variant="danger" size="sm">
                    Supprimer
                  </Button>
                </form>
              </TD>
            </TR>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
