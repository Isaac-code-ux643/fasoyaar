import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import Card from "@/components/ui/Card";

export const metadata: Metadata = { title: "Connexion admin" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center">
      <Card className="flex flex-col gap-5 p-6">
        <div>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-bf-red/10 text-bf-red">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-3 text-xl font-bold">Espace admin FASOYAAR</h1>
          <p className="text-sm text-zinc-500">
            Entrez le code admin pour gérer les villes et les sites de vente.
          </p>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
}
