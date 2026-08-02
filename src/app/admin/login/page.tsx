import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Connexion admin" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center">
      <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <span className="text-3xl">🔐</span>
          <h1 className="mt-2 text-xl font-bold">Espace admin FASOYAAR</h1>
          <p className="text-sm text-zinc-500">
            Entrez le code admin pour gérer les villes, sites, produits et prix.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
