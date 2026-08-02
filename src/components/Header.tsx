import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSelectedCity } from "@/lib/city";
import CitySwitcher from "@/components/CitySwitcher";

export default async function Header() {
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });
  const city = await getSelectedCity();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-[#EF2B2D]">FASO</span>
            <span className="text-[#FCD116]">★</span>
            <span className="text-[#009E49]">YAAR</span>
          </span>
          <span className="text-[11px] font-medium text-zinc-500">
            Prix &amp; localisation
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium sm:gap-5">
          <Link href="/catalogue" className="text-zinc-700 transition-colors hover:text-bf-red">
            Catalogue
          </Link>
          <Link
            href={city ? `/carte?ville=${city.slug}` : "/carte"}
            className="text-zinc-700 transition-colors hover:text-bf-red"
          >
            Carte
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
