"use client";

import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/villes", label: "Villes" },
  { href: "/admin/sites", label: "Sites" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {links.map((l) => {
        const active =
          l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Button key={l.href} href={l.href} variant="ghost" active={active}>
            {l.label}
          </Button>
        );
      })}
    </nav>
  );
}
