import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Nettoyage complet avant (idempotence)
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
    await prisma.city.create({ data: c });
  }

  const ouaga = await prisma.city.findUniqueOrThrow({ where: { slug: "ouagadougou" } });
  const bobo = await prisma.city.findUniqueOrThrow({ where: { slug: "bobo-dioulasso" } });
  const koudougou = await prisma.city.findUniqueOrThrow({ where: { slug: "koudougou" } });
  const ouahigouya = await prisma.city.findUniqueOrThrow({ where: { slug: "ouahigouya" } });
  const banfora = await prisma.city.findUniqueOrThrow({ where: { slug: "banfora" } });

  // ---------- Sites de vente ----------
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
    await prisma.store.create({ data: s });
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
