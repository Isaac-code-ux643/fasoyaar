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
  const stores = await prisma.store.findMany({ where: { cityId: id }, select: { id: true } });
  await prisma.listing.deleteMany({ where: { storeId: { in: stores.map((s) => s.id) } } });
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
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  if (!cityId || !name || !address || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return;
  }
  await prisma.store.create({ data: { cityId, name, address, type, latitude, longitude } });
  revalidatePath("/");
  revalidatePath("/admin/sites");
  revalidatePath("/carte");
}

export async function deleteStore(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = parseNumber(formData.get("id"));
  if (!id) return;
  await prisma.listing.deleteMany({ where: { storeId: id } });
  await prisma.store.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/sites");
  revalidatePath("/carte");
}

// ---------------------------------------------------------------
// Catégories
// ---------------------------------------------------------------
export async function createCategory(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const name = text(formData.get("name"));
  if (!name) return;
  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) return;
  await prisma.category.create({ data: { name, slug } });
  revalidatePath("/admin/produits");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = parseNumber(formData.get("id"));
  if (!id) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/produits");
}

// ---------------------------------------------------------------
// Produits
// ---------------------------------------------------------------
export async function createProduct(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const categoryId = parseNumber(formData.get("categoryId"));
  const name = text(formData.get("name"));
  const brand = text(formData.get("brand")) || null;
  const unitLabel = text(formData.get("unitLabel")) || "unité";
  const photoUrl = text(formData.get("photoUrl")) || null;
  if (!categoryId || !name) return;
  await prisma.product.create({ data: { categoryId, name, brand, unitLabel, photoUrl } });
  revalidatePath("/");
  revalidatePath("/catalogue");
  revalidatePath("/admin/produits");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = parseNumber(formData.get("id"));
  if (!id) return;
  await prisma.listing.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/catalogue");
  revalidatePath("/admin/produits");
}

// ---------------------------------------------------------------
// Prix (listings)
// ---------------------------------------------------------------
export async function createListing(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const productId = parseNumber(formData.get("productId"));
  const storeId = parseNumber(formData.get("storeId"));
  const priceUnit = parseNumber(formData.get("priceUnit"));
  if (!productId || !storeId || !priceUnit) return;
  const priceCarton = parseNumber(formData.get("priceCarton"));
  const unitsPerCarton = parseNumber(formData.get("unitsPerCarton"));
  await prisma.listing.upsert({
    where: { productId_storeId: { productId, storeId } },
    update: { priceUnit, priceCarton, unitsPerCarton },
    create: { productId, storeId, priceUnit, priceCarton, unitsPerCarton },
  });
  revalidatePath("/catalogue");
  revalidatePath("/produit");
  revalidatePath("/admin/prix");
}

export async function updateListing(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = parseNumber(formData.get("id"));
  if (!id) return;
  const priceUnit = parseNumber(formData.get("priceUnit"));
  if (!priceUnit) return;
  const priceCarton = parseNumber(formData.get("priceCarton"));
  const unitsPerCarton = parseNumber(formData.get("unitsPerCarton"));
  await prisma.listing.update({
    where: { id },
    data: { priceUnit, priceCarton, unitsPerCarton },
  });
  revalidatePath("/catalogue");
  revalidatePath("/produit");
  revalidatePath("/admin/prix");
}

export async function deleteListing(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = parseNumber(formData.get("id"));
  if (!id) return;
  await prisma.listing.delete({ where: { id } });
  revalidatePath("/catalogue");
  revalidatePath("/produit");
  revalidatePath("/admin/prix");
}
