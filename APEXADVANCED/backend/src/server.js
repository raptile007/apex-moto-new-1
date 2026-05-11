import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS blocked: origin not allowed"));
  }
}));
app.use(express.json());
app.use(morgan("dev"));

// Helper to parse JSON fields from SQLite
function parseJsonFields(item, fields) {
  if (!item) return null;
  const result = { ...item };
  for (const field of fields) {
    if (result[field]) {
      try {
        result[field] = JSON.parse(result[field]);
      } catch (e) {
        console.error(`Failed to parse ${field}`, e);
      }
    }
  }
  return result;
}

app.get("/", (_, res) => {
  res.json({
    service: "apexmoto-backend",
    database: "sqlite (via prisma)",
    message: "Backend is running",
    docs: "/health and /api/{products|shops|bikes|orders}"
  });
});

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "apexmoto-backend", db: "connected" });
});

// Products API
app.get("/api/products", async (_, res) => {
  const items = await prisma.product.findMany();
  res.json(items.map(i => parseJsonFields(i, ['specs'])));
});

app.get("/api/products/:id", async (req, res) => {
  const item = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: "Product not found" });
  res.json(parseJsonFields(item, ['specs']));
});

// Shops API
app.get("/api/shops", async (_, res) => {
  const items = await prisma.shop.findMany();
  res.json(items.map(i => parseJsonFields(i, ['services'])));
});

// Bikes API
app.get("/api/bikes", async (_, res) => {
  const items = await prisma.bike.findMany();
  res.json(items.map(i => parseJsonFields(i, ['stats', 'compatibleCategories'])));
});

// Orders API
app.get("/api/orders", async (_, res) => {
  const items = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(items.map(i => parseJsonFields(i, ['items', 'timeline'])));
});

app.post("/api/orders", async (req, res) => {
  try {
    const { items, timeline, ...rest } = req.body;
    const order = await prisma.order.create({
      data: {
        ...rest,
        items: JSON.stringify(items || []),
        timeline: JSON.stringify(timeline || []),
      }
    });
    res.status(201).json(parseJsonFields(order, ['items', 'timeline']));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`ApexMoto backend running on http://localhost:${PORT}`);
});
