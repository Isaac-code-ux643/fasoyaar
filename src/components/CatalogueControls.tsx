"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

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
        <input
          name="q"
          defaultValue={query}
          placeholder="Rechercher un produit…"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => navigate({ cat: null })}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            !activeCategory
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          Tous
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => navigate({ cat: c.slug })}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === c.slug
                ? "bg-bf-green text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="text-sm text-zinc-500" aria-live="polite">
        {isPending ? "Chargement…" : `${total} produit${total > 1 ? "s" : ""} trouvé${total > 1 ? "s" : ""}`}
      </p>
    </div>
  );
}
