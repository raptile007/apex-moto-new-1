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
      update: {},
      create: {
        ...item,
        specs: JSON.stringify(item.specs || {}),
      },
    });
  }

  // Migrate Shops
  console.log('🏪 Migrating Shops...');
  for (const item of db.shops) {
    await prisma.shop.upsert({
      where: { id: item.id },
      update: {},
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
      update: {},
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
