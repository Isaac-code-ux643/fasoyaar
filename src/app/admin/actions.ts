"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  clearAdminSession,
  isAdmin,
  setAdminSession,
  verifyAdminCode,
} from "@/lib/auth";

// ---------------------------------------------------------------
// Protection anti force brute (en mémoire)
// ---------------------------------------------------------------
const attempts = new Map<string, { count: number; until: number }>();

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function parseNumber(value: FormDataEntryValue | null): number | null {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function text(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

// ---------------------------------------------------------------
// Authentification
// ---------------------------------------------------------------
export async function login(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const ip = await clientIp();
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.until > now) {
    return { error: "Trop de tentatives. Réessayez dans 15 minutes." };
  }

  const code = text(formData.get("code"));
  if (!verifyAdminCode(code)) {
    const count = (rec?.count ?? 0) + 1;
    attempts.set(ip, { count, until: count >= 5 ? now + 15 * 60_000 : 0 });
    return { error: "Code admin incorrect." };
  }

  attempts.delete(ip);
  await setAdminSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await clearAdminSession();
  redirect("/");
}

// ---------------------------------------------------------------
// Villes
// ---------------------------------------------------------------
export async function createCity(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const name = text(formData.get("name"));
  if (!name) return;
  const slug =
    text(formData.get("slug")) ||
    name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) return;
  await prisma.city.create({ data: { name, slug } });
  revalidatePath("/");
  revalidatePath("/admin/villes");
}

export async function deleteCity(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = parseNumber(formData.get("id"));
  if (!id) return;
  await prisma.store.deleteMany({ where: { cityId: id } });
  await prisma.city.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/villes");
}

// ---------------------------------------------------------------
// Sites (magasins)
// ---------------------------------------------------------------
export async function createStore(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const cityId = parseNumber(formData.get("cityId"));
  const name = text(formData.get("name"));
  const address = text(formData.get("address"));
  const type = text(formData.get("type")) || "Supermarché";
  const mapUrl = text(formData.get("mapUrl")) || null;
  if (!cityId || !name || !address) {
    return;
  }
  await prisma.store.create({ data: { cityId, name, address, type, mapUrl } });
  revalidatePath("/");
  revalidatePath("/admin/sites");
  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (city) revalidatePath(`/ville/${city.slug}`);
}

export async function deleteStore(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = parseNumber(formData.get("id"));
  if (!id) return;
  const store = await prisma.store.findUnique({ where: { id }, select: { cityId: true } });
  await prisma.store.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/sites");
  if (store) {
    const city = await prisma.city.findUnique({ where: { id: store.cityId } });
    if (city) revalidatePath(`/ville/${city.slug}`);
  }
}
