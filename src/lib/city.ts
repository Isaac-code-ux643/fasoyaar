import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CITY_COOKIE } from "@/lib/auth";

export async function getSelectedCitySlug(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CITY_COOKIE)?.value ?? null;
}

export async function getSelectedCity() {
  const slug = await getSelectedCitySlug();
  if (!slug) return null;
  return prisma.city.findUnique({ where: { slug } });
}

export async function setSelectedCitySlug(slug: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CITY_COOKIE, slug, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}
