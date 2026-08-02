import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Globe } from "lucide-react";
import "./globals.css";
import Header from "@/components/Header";
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
    default: "FASOYAAR — Prix & localisation des marchés",
    template: "%s | FASOYAAR",
  },
  description:
    "Comparez les prix des produits (unitaire et carton) et localisez sur la carte tous les sites où les trouver, dans votre ville.",
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
        <div className="h-2 w-full bg-gradient-to-r from-bf-red via-bf-yellow to-bf-green" />
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-zinc-500 sm:flex-row">
            <span>
              © {new Date().getFullYear()} <Wordmark /> — Tous prix
              relevés à titre indicatif.
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              Comparateur de prix &amp; localisateur de marchés
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
