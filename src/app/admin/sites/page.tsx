import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Table, THead, TH, TR, TD } from "@/components/ui/Table";
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

      <Card className="p-5">
        <form action={createStore} className="grid gap-3 sm:grid-cols-2">
          <Field label="Ville">
            <Select name="cityId" required>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Type">
            <Select name="type">
              <option>Supermarché</option>
              <option>Marché</option>
              <option>Boutique</option>
            </Select>
          </Field>
          <Field label="Nom du site">
            <Input name="name" required placeholder="Ex : FASOYAAR Ouaga 2000" />
          </Field>
          <Field label="Adresse">
            <Input name="address" required placeholder="Ex : Zone du Bois" />
          </Field>
          <Field label="Lien Google Maps (facultatif)" className="sm:col-span-2">
            <Input
              name="mapUrl"
              type="url"
              placeholder="https://www.google.com/maps/search/?api=1&query=..."
            />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter le site
            </Button>
          </div>
        </form>
      </Card>

      <Table>
        <THead>
          <tr>
            <TH>Site</TH>
            <TH>Ville</TH>
            <TH>Localisation</TH>
            <TH className="text-center">Produits</TH>
            <TH className="text-right">Actions</TH>
          </tr>
        </THead>
        <tbody>
          {stores.map((s) => (
            <TR key={s.id}>
              <TD>
                <Link href={`/site/${s.id}`} className="font-semibold hover:text-bf-red">
                  {s.name}
                </Link>
                <span className="block text-xs text-zinc-500">{s.address}</span>
              </TD>
              <TD className="text-zinc-600">{s.city.name}</TD>
              <TD>
                {s.mapUrl ? (
                  <a
                    href={s.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-bf-red hover:underline"
                  >
                    Google Maps
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-zinc-400">—</span>
                )}
              </TD>
              <TD className="text-center">{s._count.listings}</TD>
              <TD className="text-right">
                <form action={deleteStore}>
                  <input type="hidden" name="id" value={s.id} />
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
