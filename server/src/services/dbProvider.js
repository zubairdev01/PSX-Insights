import prisma from "../utils/prisma.js";
import { DataProvider } from "./dataProvider.js";

export class PrismaDbProvider extends DataProvider {
  async getCompanies(filters = {}) {
    const where = {};
    if (filters.sector) where.sector = filters.sector;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { symbol: { contains: filters.search.toUpperCase() } },
      ];
    }
    return prisma.company.findMany({ where, orderBy: { symbol: "asc" } });
  }

  async getCompany(symbol) {
    return prisma.company.findUnique({
      where: { symbol: symbol.toUpperCase() },
      include: { priceHistory: { orderBy: { date: "asc" } } },
    });
  }

  async getSectors() {
    const sectors = await prisma.company.findMany({
      select: { sector: true },
      distinct: ["sector"],
      where: { sector: { not: null } },
      orderBy: { sector: "asc" },
    });
    return sectors.map((s) => s.sector);
  }

  async getPriceHistory(symbol, timeframe) {
    const days = timeframe === "1M" ? 30 : timeframe === "3M" ? 90 : timeframe === "1Y" ? 365 : 365;
    const since = new Date();
    since.setDate(since.getDate() - days);
    return prisma.priceHistory.findMany({
      where: {
        company: { symbol: symbol.toUpperCase() },
        date: { gte: since },
      },
      orderBy: { date: "asc" },
    });
  }

  async getIndices() {
    return prisma.indexRecord.findMany({ orderBy: { date: "desc" }, take: 100 });
  }
}

export const dbProvider = new PrismaDbProvider();
