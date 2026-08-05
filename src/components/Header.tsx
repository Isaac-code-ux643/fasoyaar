import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSelectedCity } from "@/lib/city";
import CitySwitcher from "@/components/CitySwitcher";
import Logo from "@/components/ui/Logo";

export default async function Header() {
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });
  const city = await getSelectedCity();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />

        <nav className="flex items-center gap-3 text-sm font-medium sm:gap-5">
          <Link
            href={city ? `/ville/${city.slug}` : "/"}
            className="text-zinc-700 transition-colors hover:text-bf-red"
          >
            Sites de vente
          </Link>
          <Link href="/admin" className="text-zinc-700 transition-colors hover:text-bf-red">
            Admin
          </Link>
          <CitySwitcher cities={cities} currentSlug={city?.slug ?? null} />
        </nav>
      </div>
    </header>
  );
}
