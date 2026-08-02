import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "fasoyaar_admin";
export const CITY_COOKIE = "fasoyaar_city";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function getAdminCode(): string {
  const code = process.env.ADMIN_CODE;
  if (!code) throw new Error("ADMIN_CODE n'est pas configuré");
  return code;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET n'est pas configuré");
  return secret;
}

function safeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Vérifie le code admin saisi sans jamais le comparer en clair (timing-safe). */
export function verifyAdminCode(input: string): boolean {
  if (!input) return false;
  return safeEqualStr(input, getAdminCode());
}

/** Jeton de session : HMAC du code admin, signé par le secret. */
export function createSessionToken(): string {
  return createHmac("sha256", getSessionSecret())
    .update(getAdminCode())
    .digest("hex");
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = Buffer.from(createSessionToken(), "hex");
  const received = Buffer.from(token, "hex");
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

/** Retourne true si la session admin courante est valide. */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

/** Redirige vers le login si l'utilisateur n'est pas admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** Définit le cookie de session admin (httpOnly, SameSite, Secure en prod). */
export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
}
