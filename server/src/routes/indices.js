import { Router } from "express";
import prisma from "../utils/prisma.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const names = await prisma.indexRecord.findMany({
      select: { name: true },
      distinct: ["name"],
    });
    const result = [];
    for (const { name } of names) {
      const data = await prisma.indexRecord.findMany({
        where: { name },
        orderBy: { date: "asc" },
      });
      const latest = data[data.length - 1];
      const first = data[0];
      result.push({
        name,
        currentValue: latest?.value,
        change: latest?.change,
        changePercent: latest?.changePercent,
        ytdChange: first ? ((latest.value - first.value) / first.value) * 100 : 0,
        data: data.slice(-252),
      });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/:name", async (req, res, next) => {
  try {
    const data = await prisma.indexRecord.findMany({
      where: { name: req.params.name },
      orderBy: { date: "asc" },
    });
    if (!data.length) return res.status(404).json({ error: "Index not found" });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
