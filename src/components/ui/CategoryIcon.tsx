import {
  Candy,
  CupSoda,
  Droplets,
  Milk,
  ShoppingCart,
  SprayCan,
  Wheat,
} from "lucide-react";

const icons = {
  huiles: Droplets,
  cereales: Wheat,
  sucreries: Candy,
  lait: Milk,
  boissons: CupSoda,
  hygiene: SprayCan,
} as const;

export default function CategoryIcon({
  slug,
  className = "h-6 w-6",
}: {
  slug: string;
  className?: string;
}) {
  const Icon = (icons as Record<string, typeof ShoppingCart>)[slug] ?? ShoppingCart;
  return <Icon className={className} aria-hidden="true" />;
}
