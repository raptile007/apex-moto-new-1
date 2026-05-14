import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"].filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: origin ${origin} not allowed`));
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
  res.json(items.map(i => parseJsonFields(i, ['specs', 'stats'])));
});

app.get("/api/products/:id", async (req, res) => {
  const item = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: "Product not found" });
  res.json(parseJsonFields(item, ['specs', 'stats']));
});

app.post("/api/products", async (req, res) => {
  try {
    const { specs, stats, ...rest } = req.body;
    const item = await prisma.product.create({
      data: {
        ...rest,
        specs: JSON.stringify(specs || {}),
        stats: JSON.stringify(stats || {}),
      }
    });
    res.status(201).json(parseJsonFields(item, ['specs', 'stats']));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { specs, stats, id, createdAt, updatedAt, ...rest } = req.body;
    const item = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        specs: specs ? JSON.stringify(specs) : undefined,
        stats: stats ? JSON.stringify(stats) : undefined,
      }
    });
    res.json(parseJsonFields(item, ['specs', 'stats']));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Shops API
app.get("/api/shops", async (_, res) => {
  const items = await prisma.shop.findMany();
  res.json(items.map(i => parseJsonFields(i, ['services'])));
});

app.post("/api/shops", async (req, res) => {
  try {
    const { services, ...rest } = req.body;
    const item = await prisma.shop.create({
      data: {
        ...rest,
        services: JSON.stringify(services || []),
      }
    });
    res.status(201).json(parseJsonFields(item, ['services']));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/api/shops/:id", async (req, res) => {
  try {
    const { services, id, createdAt, updatedAt, ...rest } = req.body;
    const item = await prisma.shop.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        services: services ? JSON.stringify(services) : undefined,
      }
    });
    res.json(parseJsonFields(item, ['services']));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/shops/:id", async (req, res) => {
  try {
    await prisma.shop.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Bikes API
app.get("/api/bikes", async (_, res) => {
  const items = await prisma.bike.findMany();
  res.json(items.map(i => parseJsonFields(i, ['stats', 'compatibleCategories'])));
});

// Orders API
app.get("/api/orders", async (_, res) => {
  try {
    const items = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    console.log(`📋 Fetched ${items.length} orders from database`);
    res.json(items.map(i => parseJsonFields(i, ['items', 'timeline', 'shippingAddress'])));
  } catch (e) {
    console.error("❌ Failed to fetch orders:", e);
    res.status(500).json({ error: e.message });
  }
});

// Garage Builds API
app.get("/api/garage", async (_, res) => {
  const items = await prisma.garageBuild.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(items.map(i => ({
    ...i,
    bike: JSON.parse(i.bike),
    parts: JSON.parse(i.parts)
  })));
});

app.post("/api/garage", async (req, res) => {
  try {
    const { bike, parts, ...rest } = req.body;
    const item = await prisma.garageBuild.create({
      data: {
        ...rest,
        bike: JSON.stringify(bike),
        parts: JSON.stringify(parts)
      }
    });
    res.status(201).json({
      ...item,
      bike: JSON.parse(item.bike),
      parts: JSON.parse(item.parts)
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/garage/:id", async (req, res) => {
  try {
    await prisma.garageBuild.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Resident Data API (from DB)
app.get("/api/resident/stats", async (_, res) => {
  const items = await prisma.telemetry.findMany();
  res.json(items);
});

app.get("/api/resident/achievements", async (_, res) => {
  const items = await prisma.achievement.findMany();
  res.json(items);
});

app.post("/api/orders", async (req, res) => {
  try {
    const { 
      id, orderNumber, customerName, total, status, 
      items, timeline, trackingNumber, customerEmail, 
      customerId, customerPhone, estimatedDelivery, 
      paymentMethod, paymentStatus, shipping, 
      shippingAddress, subtotal, tax 
    } = req.body;

    console.log(`📝 Creating new order: ${orderNumber} for ${customerName}`);

    const order = await prisma.order.create({
      data: {
        id,
        orderNumber,
        customerName,
        total,
        status,
        trackingNumber,
        customerEmail,
        customerId,
        customerPhone,
        estimatedDelivery,
        paymentMethod,
        paymentStatus,
        shipping,
        subtotal,
        tax,
        items: JSON.stringify(items || []),
        timeline: JSON.stringify(timeline || []),
        shippingAddress: JSON.stringify(shippingAddress || {}),
      }
    });
    
    // Create activity log
    await prisma.activityLog.create({
      data: {
        type: "order",
        action: `New order ${orderNumber} placed by ${customerName}`,
        details: JSON.stringify({ orderId: order.id, total })
      }
    });
    
    console.log(`✅ Order ${orderNumber} saved to database`);
    res.status(201).json(parseJsonFields(order, ['items', 'timeline', 'shippingAddress']));
  } catch (e) {
    console.error(`❌ Order creation failed for ${req.body.orderNumber}:`, e);
    res.status(400).json({ error: e.message });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  try {
    const { 
      status, trackingNumber, paymentStatus, 
      estimatedDelivery, timeline 
    } = req.body;

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        trackingNumber,
        paymentStatus,
        estimatedDelivery,
        timeline: timeline ? JSON.stringify(timeline) : undefined,
      }
    });
    res.json(parseJsonFields(order, ['items', 'timeline', 'shippingAddress']));
  } catch (e) {
    console.error("Order update failed:", e);
    res.status(400).json({ error: e.message });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Bookings API
app.get("/api/bookings", async (_, res) => {
  try {
    const items = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const item = await prisma.booking.create({
      data: req.body
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        type: "booking",
        action: `New service booked: ${req.body.service} at ${req.body.shopName}`,
        details: JSON.stringify({ bookingId: item.id, date: req.body.date })
      }
    });

    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Activities API
app.get("/api/activities", async (_, res) => {
  try {
    const items = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`ApexMoto backend running on http://localhost:${PORT}`);
});
