"use client";

import { selectCity } from "@/app/actions";
import { MapPin } from "lucide-react";

export default function CitySwitcher({
  cities,
  currentSlug,
}: {
  cities: { slug: string; name: string }[];
  currentSlug: string | null;
}) {
  return (
    <form action={selectCity} className="flex items-center gap-1">
      <MapPin className="hidden h-4 w-4 text-zinc-400 sm:block" aria-hidden="true" />
      <select
        name="slug"
        aria-label="Choisir une ville"
        defaultValue={currentSlug ?? ""}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="max-w-40 cursor-pointer rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-800 transition-colors hover:border-bf-green focus:border-bf-green"
      >
        <option value="" disabled>
          Choisir une ville
        </option>
        {cities.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </form>
  );
}
