import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { MapPin } from "lucide-react";
import "./globals.css";
import Header from "@/components/Header";
import FlagBackdrop from "@/components/ui/FlagBackdrop";
import Flag from "@/components/ui/Flag";
import { Wordmark } from "@/components/ui/Logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FASOYAAR — Localisateur de sites de vente",
    template: "%s | FASOYAAR",
  },
  description:
    "Trouvez les supermarchés, marchés et boutiques de votre ville et l'itinéraire Google Maps pour vous y rendre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-zinc-900">
        <FlagBackdrop />
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
        <footer className="mt-auto border-t border-zinc-200 bg-white/85 backdrop-blur">
          <div className="h-1 w-full bg-gradient-to-r from-bf-red via-bf-yellow to-bf-green" />
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:items-end">
            <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
              <span>
                © {new Date().getFullYear()}{" "}
                <Wordmark className="whitespace-nowrap" /> — Localisateur de
                sites de vente.
              </span>
              <span className="flex items-center gap-1.5">
                <Flag className="h-3 w-auto" />
                Référencement des sites de vente au Burkina Faso.
              </span>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 font-medium text-zinc-600 transition-colors hover:text-bf-red"
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Espace administrateur
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
