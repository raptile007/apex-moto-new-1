import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/store.json');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting migration from store.json to SQLite...');

  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  const db = JSON.parse(raw);

  // Migrate Products
  console.log('📦 Migrating Products...');
  for (const item of db.products) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        brand: item.brand,
        category: item.category,
        price: item.price,
        description: item.description,
        image: item.image,
        stock: item.stock,
        stockStatus: item.stockStatus,
        specs: JSON.stringify(item.specs || {}),
        stats: JSON.stringify(item.stats || {}),
      },
      create: {
        ...item,
        specs: JSON.stringify(item.specs || {}),
        stats: JSON.stringify(item.stats || {}),
      },
    });
  }

  // Migrate Shops
  console.log('🏪 Migrating Shops...');
  for (const item of db.shops) {
    await prisma.shop.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        city: item.city,
        lat: item.lat,
        lng: item.lng,
        address: item.address,
        phone: item.phone,
        hours: item.hours,
        services: JSON.stringify(item.services || []),
      },
      create: {
        ...item,
        services: JSON.stringify(item.services || []),
      },
    });
  }

  // Migrate Bikes
  console.log('🏍️ Migrating Bikes...');
  for (const item of db.bikes) {
    await prisma.bike.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        brand: item.brand,
        model: item.model,
        year: item.year,
        basePrice: item.basePrice,
        image: item.image,
        stats: JSON.stringify(item.stats || {}),
        compatibleCategories: JSON.stringify(item.compatibleCategories || []),
      },
      create: {
        ...item,
        stats: JSON.stringify(item.stats || {}),
        compatibleCategories: JSON.stringify(item.compatibleCategories || []),
      },
    });
  }

  // Migrate Orders
  console.log('🧾 Migrating Orders...');
  if (db.orders) {
    for (const item of db.orders) {
      await prisma.order.upsert({
        where: { id: item.id },
        update: {},
        create: {
          ...item,
          items: JSON.stringify(item.items || []),
          timeline: JSON.stringify(item.timeline || []),
        },
      });
    }
  }

  // Seed Telemetry
  console.log("📊 Seeding Telemetry...");
  const telemetry = [
    { id: "tel-001", label: "ENGINE_THERMAL", value: 82, unit: "°C", trend: "stable", color: "apex-orange" },
    { id: "tel-002", label: "RPM_STABILITY", value: 94, unit: "%", trend: "up", color: "emerald-500" },
    { id: "tel-003", label: "FUEL_EFFICIENCY", value: 18, unit: "KM/L", trend: "down", color: "red-500" },
    { id: "tel-004", label: "BRAKING_FORCE", value: 9.8, unit: "M/S²", trend: "up", color: "red-500" }
  ];

  for (const t of telemetry) {
    await prisma.telemetry.upsert({
      where: { id: t.id },
      update: t,
      create: t
    });
  }

  // Seed Achievements
  console.log("🏆 Seeding Achievements...");
  const achievements = [
    { id: "ach-001", title: "Apex Pilot", description: "Reach a total flight distance of 5,000 KM.", rarity: "COMMON", unlockedAt: new Date("2024-02-15"), progress: 100 },
    { id: "ach-002", title: "Master Engineer", description: "Complete 10 custom builds in the Virtual Garage.", rarity: "RARE", unlockedAt: null, progress: 70 },
    { id: "ach-003", title: "Ghost Rider", description: "Operate the dashboard during night hours (22:00 - 04:00).", rarity: "LEGENDARY", unlockedAt: new Date("2024-03-01"), progress: 100 }
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { id: a.id },
      update: a,
      create: a
    });
  }

  console.log('✅ Migration complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
