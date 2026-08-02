import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Table, THead, TH, TR, TD } from "@/components/ui/Table";
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Prix</h1>
        <AdminNav />
      </div>

      <Card className="p-5">
        <form action={createListing} className="grid gap-3 sm:grid-cols-2">
          <Field label="Produit">
            <Select name="productId" required>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category.name})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Site">
            <Select name="storeId" required>
              {cities.map((c) => (
                <optgroup key={c.id} label={c.name}>
                  {c.stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </Field>
          <Field label="Prix unitaire (FCFA)">
            <Input name="priceUnit" required type="number" min="1" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix carton">
              <Input name="priceCarton" type="number" min="1" />
            </Field>
            <Field label="Qté / carton">
              <Input name="unitsPerCarton" type="number" min="1" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter / mettre à jour le prix
            </Button>
          </div>
        </form>
      </Card>

      <Table>
        <THead>
          <tr>
            <TH>Produit</TH>
            <TH>Site</TH>
            <TH>Unité (F)</TH>
            <TH>Carton (F)</TH>
            <TH>Qté/carton</TH>
            <TH className="text-right">Actions</TH>
          </tr>
        </THead>
        <tbody>
          {listings.map((l) => (
            <TR key={l.id} className="align-middle">
              <TD>
                <span className="font-semibold">{l.product.name}</span>
                <span className="block text-xs text-zinc-500">
                  {l.product.category.name}
                </span>
              </TD>
              <TD className="text-zinc-600">{l.store.name}</TD>
              <TD>
                <Input
                  form={`edit-${l.id}`}
                  name="priceUnit"
                  type="number"
                  min="1"
                  defaultValue={l.priceUnit}
                  compact
                  className="w-28"
                />
              </TD>
              <TD>
                <Input
                  form={`edit-${l.id}`}
                  name="priceCarton"
                  type="number"
                  min="1"
                  defaultValue={l.priceCarton ?? ""}
                  placeholder="—"
                  compact
                  className="w-28"
                />
              </TD>
              <TD>
                <Input
                  form={`edit-${l.id}`}
                  name="unitsPerCarton"
                  type="number"
                  min="1"
                  defaultValue={l.unitsPerCarton ?? ""}
                  placeholder="—"
                  compact
                  className="w-20"
                />
              </TD>
              <TD className="text-right">
                <div className="flex justify-end gap-2">
                  <form id={`edit-${l.id}`} action={updateListing}>
                    <input type="hidden" name="id" value={l.id} />
                    <Button type="submit" variant="dark" size="sm">
                      Enregistrer
                    </Button>
                  </form>
                  <form action={deleteListing}>
                    <input type="hidden" name="id" value={l.id} />
                    <Button type="submit" variant="danger" size="sm">
                      Supprimer
                    </Button>
                  </form>
                </div>
              </TD>
            </TR>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
