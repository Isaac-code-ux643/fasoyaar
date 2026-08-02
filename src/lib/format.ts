export function formatPrice(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export const CATEGORY_EMOJI: Record<string, string> = {
  huiles: "🛢️",
  cereales: "🌾",
  sucreries: "🍬",
  lait: "🥛",
  boissons: "🥤",
  hygiene: "🧼",
};

export function categoryEmoji(slug: string): string {
  return CATEGORY_EMOJI[slug] ?? "🛒";
}
