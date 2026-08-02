import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Nettoyage complet avant (idempotence)
  await prisma.listing.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.city.deleteMany();

  // ---------- Villes ----------
  const cities = [
    { name: "Ouagadougou", slug: "ouagadougou" },
    { name: "Bobo-Dioulasso", slug: "bobo-dioulasso" },
    { name: "Koudougou", slug: "koudougou" },
    { name: "Ouahigouya", slug: "ouahigouya" },
    { name: "Banfora", slug: "banfora" },
  ];

  for (const c of cities) {
    await prisma.city.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
  }

  const ouaga = await prisma.city.findUniqueOrThrow({ where: { slug: "ouagadougou" } });
  const bobo = await prisma.city.findUniqueOrThrow({ where: { slug: "bobo-dioulasso" } });
  const koudougou = await prisma.city.findUniqueOrThrow({ where: { slug: "koudougou" } });
  const ouahigouya = await prisma.city.findUniqueOrThrow({ where: { slug: "ouahigouya" } });
  const banfora = await prisma.city.findUniqueOrThrow({ where: { slug: "banfora" } });

  // ---------- Sites ----------
  const stores = [
    // Ouagadougou
    { cityId: ouaga.id, name: "FASOYAAR Ouaga 2000", address: "Zone du Bois, Ouaga 2000", mapUrl: "https://www.google.com/maps/search/?api=1&query=Ouaga+2000+Ouagadougou", type: "Supermarché" },
    { cityId: ouaga.id, name: "FASOYAAR Cissin", address: "Route de Kaya, secteur 24", mapUrl: "https://www.google.com/maps/search/?api=1&query=Cissin+Ouagadougou", type: "Supermarché" },
    { cityId: ouaga.id, name: "FASOYAAR Centre-ville", address: "Av. Kwame N'Krumah", mapUrl: "https://www.google.com/maps/search/?api=1&query=Ouagadougou+centre-ville", type: "Supermarché" },
    { cityId: ouaga.id, name: "FASOYAAR Pissy", address: "Avenue de Pissy, secteur 4", mapUrl: "https://www.google.com/maps/search/?api=1&query=Pissy+Ouagadougou", type: "Supermarché" },
    { cityId: ouaga.id, name: "FASOYAAR Gounghin", address: "Quartier Gounghin", mapUrl: "https://www.google.com/maps/search/?api=1&query=Gounghin+Ouagadougou", type: "Supermarché" },
    // Bobo-Dioulasso
    { cityId: bobo.id, name: "FASOYAAR Bobo 1", address: "Av. de la République, Bobo-Dioulasso", mapUrl: "https://www.google.com/maps/search/?api=1&query=Centre-ville+Bobo-Dioulasso", type: "Supermarché" },
    { cityId: bobo.id, name: "FASOYAAR Bobo 2", address: "Zone de Saccoua, Bobo-Dioulasso", mapUrl: "https://www.google.com/maps/search/?api=1&query=Saccoua+Bobo-Dioulasso", type: "Supermarché" },
    // Autres villes
    { cityId: koudougou.id, name: "FASOYAAR Koudougou", address: "Centre-ville de Koudougou", mapUrl: "https://www.google.com/maps/search/?api=1&query=Koudougou+Burkina+Faso", type: "Supermarché" },
    { cityId: ouahigouya.id, name: "FASOYAAR Ouahigouya", address: "Centre-ville de Ouahigouya", mapUrl: "https://www.google.com/maps/search/?api=1&query=Ouahigouya+Burkina+Faso", type: "Supermarché" },
    { cityId: banfora.id, name: "FASOYAAR Banfora", address: "Centre-ville de Banfora", mapUrl: "https://www.google.com/maps/search/?api=1&query=Banfora+Burkina+Faso", type: "Supermarché" },
  ];

  for (const s of stores) {
    await prisma.store.upsert({
      where: { id: 0 },
      update: {},
      create: s,
    });
  }

  // ---------- Catégories ----------
  const categories = [
    { name: "Huiles & Graisses", slug: "huiles" },
    { name: "Riz & Céréales", slug: "cereales" },
    { name: "Sucreries & Café", slug: "sucreries" },
    { name: "Lait & Dérivés", slug: "lait" },
    { name: "Boissons", slug: "boissons" },
    { name: "Hygiène & Entretien", slug: "hygiene" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }

  const catHuiles = await prisma.category.findUniqueOrThrow({ where: { slug: "huiles" } });
  const catCereales = await prisma.category.findUniqueOrThrow({ where: { slug: "cereales" } });
  const catSucreries = await prisma.category.findUniqueOrThrow({ where: { slug: "sucreries" } });
  const catLait = await prisma.category.findUniqueOrThrow({ where: { slug: "lait" } });
  const catBoissons = await prisma.category.findUniqueOrThrow({ where: { slug: "boissons" } });
  const catHygiene = await prisma.category.findUniqueOrThrow({ where: { slug: "hygiene" } });

  // ---------- Produits ----------
  const products = [
    { categoryId: catHuiles.id, name: "Huile végétale (1L)", brand: "Sovita", unitLabel: "bouteille de 1 L", photoUrl: null },
    { categoryId: catHuiles.id, name: "Huile végétale (5L)", brand: "Sovita", unitLabel: "bidon de 5 L", photoUrl: null },
    { categoryId: catHuiles.id, name: "Huile végétale (20L)", brand: "Sovita", unitLabel: "bidon de 20 L", photoUrl: null },
    { categoryId: catCereales.id, name: "Riz parfumé long grain (25 kg)", brand: "Gamal", unitLabel: "sac de 25 kg", photoUrl: null },
    { categoryId: catCereales.id, name: "Riz parfumé long grain (5 kg)", brand: "Gamal", unitLabel: "sac de 5 kg", photoUrl: null },
    { categoryId: catCereales.id, name: "Spaghetti", brand: "Nabil", unitLabel: "paquet de 500 g", photoUrl: null },
    { categoryId: catSucreries.id, name: "Sucre en poudre (1 kg)", brand: "SOSUCO", unitLabel: "paquet de 1 kg", photoUrl: null },
    { categoryId: catSucreries.id, name: "Sucre en morceaux (1 kg)", brand: "SOSUCO", unitLabel: "boîte de 1 kg", photoUrl: null },
    { categoryId: catSucreries.id, name: "Café (200 g)", brand: "Benko", unitLabel: "paquet de 200 g", photoUrl: null },
    { categoryId: catLait.id, name: "Lait en poudre (400 g)", brand: "Nido", unitLabel: "boîte de 400 g", photoUrl: null },
    { categoryId: catLait.id, name: "Lait concentré sucré (397 g)", brand: "Nestlé", unitLabel: "boîte de 397 g", photoUrl: null },
    { categoryId: catBoissons.id, name: "Eau minérale (1,5 L)", brand: "Faso Eau", unitLabel: "bouteille de 1,5 L", photoUrl: null },
    { categoryId: catBoissons.id, name: "Jus de bissap (1 L)", brand: "Dafani", unitLabel: "bouteille de 1 L", photoUrl: null },
    { categoryId: catBoissons.id, name: "Boisson gazeuse (33 cl)", brand: "Coca-Cola", unitLabel: "bouteille de 33 cl", photoUrl: null },
    { categoryId: catHygiene.id, name: "Savon de toilette (200 g)", brand: "Afro", unitLabel: "pain de 200 g", photoUrl: null },
    { categoryId: catHygiene.id, name: "Détergent en poudre (1 kg)", brand: "Tigre", unitLabel: "boîte de 1 kg", photoUrl: null },
    { categoryId: catHygiene.id, name: "Dentifrice (75 ml)", brand: "Colgate", unitLabel: "tube de 75 ml", photoUrl: null },
  ];

  const createdProducts = [];
  for (const p of products) {
    createdProducts.push(await prisma.product.create({ data: p }));
  }

  // ---------- Prix (listings) ----------
  const allStores = await prisma.store.findMany();

  // base price per product (FCFA) : [unit, carton, unitsPerCarton]
  const prices = {
    "Huile végétale (1L)": [1200, 13200, 12],
    "Huile végétale (5L)": [5750, 66000, 12],
    "Huile végétale (20L)": [21500, null, null],
    "Riz parfumé long grain (25 kg)": [16200, null, null],
    "Riz parfumé long grain (5 kg)": [3600, null, null],
    "Spaghetti": [450, 10800, 24],
    "Sucre en poudre (1 kg)": [700, 16100, 23],
    "Sucre en morceaux (1 kg)": [800, 18400, 23],
    "Café (200 g)": [900, null, null],
    "Lait en poudre (400 g)": [2000, 24000, 12],
    "Lait concentré sucré (397 g)": [850, 20400, 24],
    "Eau minérale (1,5 L)": [500, 6000, 12],
    "Jus de bissap (1 L)": [1100, 13200, 12],
    "Boisson gazeuse (33 cl)": [600, 7200, 12],
    "Savon de toilette (200 g)": [350, 8400, 24],
    "Détergent en poudre (1 kg)": [1400, 16800, 12],
    "Dentifrice (75 ml)": [1000, 12000, 12],
  };

  for (const store of allStores) {
    // Chaque magasin ne référence pas forcément tout le catalogue
    const subset =
      store.cityId === ouaga.id
        ? createdProducts
        : store.cityId === bobo.id
          ? createdProducts.slice(0, 12)
          : createdProducts.slice(0, 8);

    for (const p of subset) {
      const base = prices[p.name] ?? [1000, 12000, 12];
      const variation = (Math.random() - 0.5) * 0.06; // +/- 3 %
      const unit = Math.round((base[0] * (1 + variation)) / 25) * 25;
      const carton = base[1] ? Math.round((base[1] * (1 + variation)) / 100) * 100 : null;

      await prisma.listing.create({
        data: {
          productId: p.id,
          storeId: store.id,
          priceUnit: unit,
          priceCarton: carton,
          unitsPerCarton: base[2],
        },
      });
    }
  }

  console.log("Seed terminé avec succès.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
