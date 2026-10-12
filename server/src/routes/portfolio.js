import { Router } from "express";
import prisma from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const holdings = await prisma.holding.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    const symbols = [...new Set(holdings.map((h) => h.symbol))];
    const companies = await prisma.company.findMany({
      where: { symbol: { in: symbols } },
      select: { symbol: true, currentPrice: true, dayChangePercent: true, dayChange: true },
    });
    const priceMap = Object.fromEntries(companies.map((c) => [c.symbol, { currentPrice: c.currentPrice, dayChangePercent: c.dayChangePercent, dayChange: c.dayChange }]));
    const enriched = holdings.map((h) => ({
      ...h,
      currentPrice: priceMap[h.symbol]?.currentPrice || h.avgCost,
      dayChangePercent: priceMap[h.symbol]?.dayChangePercent || 0,
      dayChange: priceMap[h.symbol]?.dayChange || 0,
      marketValue: (priceMap[h.symbol]?.currentPrice || h.avgCost) * h.quantity,
      costBasis: h.avgCost * h.quantity,
      unrealizedPnl: ((priceMap[h.symbol]?.currentPrice || h.avgCost) - h.avgCost) * h.quantity,
      unrealizedPnlPercent: h.avgCost > 0 ? (((priceMap[h.symbol]?.currentPrice || h.avgCost) - h.avgCost) / h.avgCost) * 100 : 0,
    }));
    res.json(enriched);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { symbol, quantity, avgCost, purchaseDate, notes } = req.body;
    if (!symbol || !quantity || !avgCost || !purchaseDate) {
      return res.status(400).json({ error: "symbol, quantity, avgCost, purchaseDate are required" });
    }
    const holding = await prisma.holding.create({
      data: {
        userId: req.userId,
        symbol: symbol.toUpperCase(),
        quantity: parseFloat(quantity),
        avgCost: parseFloat(avgCost),
        purchaseDate: new Date(purchaseDate),
        notes,
      },
    });
    res.status(201).json(holding);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, avgCost, purchaseDate, notes } = req.body;
    const existing = await prisma.holding.findFirst({ where: { id: parseInt(id), userId: req.userId } });
    if (!existing) return res.status(404).json({ error: "Holding not found" });
    const holding = await prisma.holding.update({
      where: { id: parseInt(id) },
      data: {
        ...(quantity !== undefined && { quantity: parseFloat(quantity) }),
        ...(avgCost !== undefined && { avgCost: parseFloat(avgCost) }),
        ...(purchaseDate !== undefined && { purchaseDate: new Date(purchaseDate) }),
        ...(notes !== undefined && { notes }),
      },
    });
    res.json(holding);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.holding.findFirst({ where: { id: parseInt(id), userId: req.userId } });
    if (!existing) return res.status(404).json({ error: "Holding not found" });
    await prisma.holding.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Holding deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
