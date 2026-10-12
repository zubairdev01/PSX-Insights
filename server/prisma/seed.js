import "dotenv/config";
import prisma from "../src/utils/prisma.js";
import { getMockData } from "../src/services/mockData.js";

async function main() {
  console.log("Seeding database...");

  await prisma.priceHistory.deleteMany();
  await prisma.dividend.deleteMany();
  await prisma.company.deleteMany();

  const companies = getMockData();

  for (const c of companies) {
    const { priceHistory, ...companyData } = c;
    const created = await prisma.company.create({
      data: {
        ...companyData,
        lastUpdated: new Date(),
        priceHistory: {
          create: priceHistory.map((p) => ({
            date: p.date,
            open: p.open,
            high: p.high,
            low: p.low,
            close: p.close,
            volume: p.volume,
          })),
        },
      },
    });
    console.log(`  Created ${created.symbol} - ${created.name}`);
  }

  const kse100 = generateIndexData("KSE-100", 48000, 54000);
  for (const r of kse100) {
    await prisma.indexRecord.create({ data: r }).catch(() => {});
  }
  const kse30 = generateIndexData("KSE-30", 18000, 21000);
  for (const r of kse30) {
    await prisma.indexRecord.create({ data: r }).catch(() => {});
  }

  console.log(`Seeded ${companies.length} companies with price history.`);
  console.log("Done!");
}

function generateIndexData(name, baseStart, baseEnd) {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);
  let value = baseStart;
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 5 || date.getDay() === 6) continue;
    value += (Math.random() - 0.48) * (baseEnd - baseStart) * 0.01;
    value = Math.max(value, baseStart * 0.8);
    const prevValue = data.length > 0 ? data[data.length - 1].value : value;
    data.push({
      name,
      value: Math.round(value * 100) / 100,
      change: Math.round((value - prevValue) * 100) / 100,
      changePercent: Math.round(((value - prevValue) / prevValue) * 10000) / 100,
      date,
    });
  }
  return data;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
