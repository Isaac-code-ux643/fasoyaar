import { NextResponse, type NextRequest } from "next/server";
import { CITY_COOKIE } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) return NextResponse.redirect(new URL("/", req.url));

  const res = NextResponse.redirect(new URL("/catalogue", req.url));
  res.cookies.set(CITY_COOKIE, slug, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
