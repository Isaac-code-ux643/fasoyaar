import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Table, THead, TH, TR, TD } from "@/components/ui/Table";
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

      <Card className="p-5">
        <form action={createCity} className="grid gap-3 sm:grid-cols-2">
          <Field label="Nom de la ville">
            <Input name="name" required placeholder="Ex : Ouagadougou" />
          </Field>
          <Field label="Identifiant (optionnel)">
            <Input name="slug" placeholder="Ex : ouagadougou" />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter la ville
            </Button>
          </div>
        </form>
      </Card>

      <Table>
        <THead>
          <tr>
            <TH>Nom</TH>
            <TH>Identifiant</TH>
            <TH className="text-center">Sites</TH>
            <TH className="text-right">Actions</TH>
          </tr>
        </THead>
        <tbody>
          {cities.map((c) => (
            <TR key={c.id}>
              <TD className="font-semibold">{c.name}</TD>
              <TD className="text-zinc-500">{c.slug}</TD>
              <TD className="text-center">{c._count.stores}</TD>
              <TD className="text-right">
                <form action={deleteCity}>
                  <input type="hidden" name="id" value={c.id} />
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
