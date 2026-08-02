"use client";

import { selectCity } from "@/app/actions";

export default function CitySwitcher({
  cities,
  currentSlug,
}: {
  cities: { slug: string; name: string }[];
  currentSlug: string | null;
}) {
  return (
    <form action={selectCity} className="flex items-center gap-1">
      <span className="hidden text-xs text-zinc-500 sm:inline">📍</span>
      <select
        name="slug"
        defaultValue={currentSlug ?? ""}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="max-w-40 cursor-pointer rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500"
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
