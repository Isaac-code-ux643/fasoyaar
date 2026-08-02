"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

export default function CatalogueControls({
  categories,
  activeCategory,
  query,
  total,
}: {
  categories: { slug: string; name: string }[];
  activeCategory: string | null;
  query: string;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function navigate(params: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `/catalogue?${qs}` : "/catalogue");
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          navigate({ q: String(fd.get("q") ?? "").trim() || null });
        }}
      >
        <Input
          name="q"
          defaultValue={query}
          placeholder="Rechercher un produit…"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          active={!activeCategory}
          activeVariant="dark"
          onClick={() => navigate({ cat: null })}
        >
          Tous
        </Button>
        {categories.map((c) => (
          <Button
            key={c.slug}
            type="button"
            variant="ghost"
            active={activeCategory === c.slug}
            onClick={() => navigate({ cat: c.slug })}
          >
            {c.name}
          </Button>
        ))}
      </div>

      <p className="text-sm text-zinc-500" aria-live="polite">
        {isPending ? "Chargement…" : `${total} produit${total > 1 ? "s" : ""} trouvé${total > 1 ? "s" : ""}`}
      </p>
    </div>
  );
}
