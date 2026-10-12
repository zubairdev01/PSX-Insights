import { Router } from "express";
import prisma from "../utils/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const dividends = await prisma.userDividend.findMany({
      where: { userId: req.userId },
      include: {
        holding: { select: { symbol: true, quantity: true } },
        dividend: {
          select: { exDate: true, amount: true, paymentDate: true, companyId: true,
            company: { select: { symbol: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(dividends);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { holdingId, amount, exDate, sharesAtExDate, reinvested, sharesAdded } = req.body;
    if (!holdingId || !amount || !exDate) {
      return res.status(400).json({ error: "holdingId, amount, exDate are required" });
    }
    const holding = await prisma.holding.findFirst({ where: { id: holdingId, userId: req.userId } });
    if (!holding) return res.status(404).json({ error: "Holding not found" });

    const ud = await prisma.userDividend.create({
      data: {
        userId: req.userId,
        holdingId,
        dividendId: 0,
        sharesAtExDate: parseFloat(sharesAtExDate || 0),
        amountReceived: parseFloat(amount),
        reinvested: reinvested || false,
        sharesAdded: sharesAdded ? parseFloat(sharesAdded) : null,
      },
    });
    res.status(201).json(ud);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.userDividend.findFirst({ where: { id: parseInt(req.params.id), userId: req.userId } });
    if (!existing) return res.status(404).json({ error: "Dividend record not found" });
    await prisma.userDividend.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

router.get("/projection", async (req, res, next) => {
  try {
    const holdings = await prisma.holding.findMany({ where: { userId: req.userId } });
    const symbols = [...new Set(holdings.map((h) => h.symbol))];
    const companies = await prisma.company.findMany({
      where: { symbol: { in: symbols }, dividendYield: { not: null } },
    });
    const projection = companies.map((c) => {
      const holding = holdings.find((h) => h.symbol === c.symbol);
      if (!holding) return null;
      const annualDivPerShare = c.currentPrice * (c.dividendYield || 0);
      const projectedAnnual = annualDivPerShare * holding.quantity;
      const monthly = projectedAnnual / 12;
      return {
        symbol: c.symbol,
        shares: holding.quantity,
        dividendYield: c.dividendYield,
        annualPerShare: annualDivPerShare,
        projectedAnnual,
        projectedMonthly: monthly,
      };
    }).filter(Boolean);
    res.json(projection);
  } catch (err) {
    next(err);
  }
});

export default router;
