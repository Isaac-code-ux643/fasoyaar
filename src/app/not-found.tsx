import Link from "next/link";
import { Compass } from "lucide-react";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-10 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bf-red/10 text-bf-red">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Erreur 404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900">
          Page introuvable
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-zinc-500">
          Cette page n&apos;existe pas ou n&apos;est plus disponible. Retournez
          à l&apos;accueil pour choisir votre ville.
        </p>
      </div>
      <Button href="/">Retour à l&apos;accueil</Button>
      <Link href="/" aria-hidden="true" className="sr-only">
        Accueil
      </Link>
    </div>
  );
}
