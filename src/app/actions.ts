"use server";

import { redirect } from "next/navigation";
import { setSelectedCitySlug } from "@/lib/city";

export async function selectCity(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;
  await setSelectedCitySlug(slug);
  redirect(`/ville/${slug}`);
}
