const COMPANIES = [
  {
    symbol: "MARI", name: "Mari Petroleum Company Limited", sector: "Oil & Gas Exploration",
    ceo: "Jameel Ahmed", website: "https://maripetroleum.com", registrar: "CDC Share Registrar Services", auditor: "A.F. Ferguson & Co.",
    sharesOutstanding: 133600000, freeFloat: 35, marketCap: 1402800000000,
    pe: 8.5, pb: 2.1, eps: 1235, dividendYield: 0.045, roe: 0.28,
    revenue: 180000000000, profitAfterTax: 70000000000,
    currentPrice: 10500, dayChange: 120, dayChangePercent: 1.16,
    week52High: 11200, week52Low: 8200, ytdChange: 8.5, year1Change: 12.3,
  },
  {
    symbol: "OGDC", name: "Oil & Gas Development Company", sector: "Oil & Gas Exploration",
    ceo: "Ali Pervaiz", website: "https://ogdcl.com", registrar: "FAMCO Share Registration Services", auditor: "Ernst & Young",
    sharesOutstanding: 4300000000, freeFloat: 25, marketCap: 580500000000,
    pe: 4.2, pb: 0.9, eps: 32.1, dividendYield: 0.072, roe: 0.22,
    revenue: 420000000000, profitAfterTax: 138000000000,
    currentPrice: 135, dayChange: -1.5, dayChangePercent: -1.10,
    week52High: 155, week52Low: 110, ytdChange: -4.2, year1Change: 8.1,
  },
  {
    symbol: "PPL", name: "Pakistan Petroleum Limited", sector: "Oil & Gas Exploration",
    ceo: "Moin Raza Khan", website: "https://ppl.com.pk", registrar: "FAMCO", auditor: "A.F. Ferguson & Co.",
    sharesOutstanding: 2729000000, freeFloat: 33, marketCap: 245610000000,
    pe: 3.8, pb: 0.85, eps: 23.7, dividendYield: 0.088, roe: 0.24,
    revenue: 310000000000, profitAfterTax: 95000000000,
    currentPrice: 90, dayChange: 0.8, dayChangePercent: 0.90,
    week52High: 105, week52Low: 72, ytdChange: -5.1, year1Change: 5.6,
  },
  {
    symbol: "POL", name: "Pakistan Oilfields Limited", sector: "Oil & Gas Exploration",
    ceo: "Rashid A. Khan", website: "https://pol.com.pk", registrar: "CDC", auditor: "KPMG",
    sharesOutstanding: 475000000, freeFloat: 40, marketCap: 190000000000,
    pe: 5.1, pb: 1.8, eps: 78.5, dividendYield: 0.065, roe: 0.32,
    revenue: 95000000000, profitAfterTax: 37000000000,
    currentPrice: 400, dayChange: 5, dayChangePercent: 1.27,
    week52High: 430, week52Low: 310, ytdChange: 10.2, year1Change: 15.8,
  },
  {
    symbol: "LUCK", name: "Lucky Cement Limited", sector: "Cement",
    ceo: "Noman Hasan", website: "https://lucky-cement.com", registrar: "CDC", auditor: "A.F. Ferguson & Co.",
    sharesOutstanding: 3269000000, freeFloat: 45, marketCap: 359590000000,
    pe: 6.2, pb: 1.5, eps: 17.8, dividendYield: 0.055, roe: 0.26,
    revenue: 280000000000, profitAfterTax: 58000000000,
    currentPrice: 110, dayChange: -2.2, dayChangePercent: -1.96,
    week52High: 128, week52Low: 82, ytdChange: 12.5, year1Change: 20.3,
  },
  {
    symbol: "DGKC", name: "D.G. Khan Cement Company", sector: "Cement",
    ceo: "Rizwan H. Ghani", website: "https://dgkhan.com", registrar: "CDC", auditor: "Rahman Sarfaraz",
    sharesOutstanding: 438000000, freeFloat: 50, marketCap: 32850000000,
    pe: 7.8, pb: 0.9, eps: 9.6, dividendYield: 0.048, roe: 0.14,
    revenue: 65000000000, profitAfterTax: 4200000000,
    currentPrice: 75, dayChange: -0.5, dayChangePercent: -0.66,
    week52High: 92, week52Low: 56, ytdChange: 5.8, year1Change: -3.2,
  },
  {
    symbol: "MLCF", name: "Maple Leaf Cement Factory", sector: "Cement",
    ceo: "Tariq Saeed", website: "https://mapleleafcement.com", registrar: "FAMCO", auditor: "Grant Thornton",
    sharesOutstanding: 647000000, freeFloat: 55, marketCap: 29115000000,
    pe: 9.2, pb: 0.7, eps: 4.9, dividendYield: 0.032, roe: 0.08,
    revenue: 42000000000, profitAfterTax: 3200000000,
    currentPrice: 45, dayChange: 0.3, dayChangePercent: 0.67,
    week52High: 58, week52Low: 34, ytdChange: -8.2, year1Change: -12.5,
  },
  {
    symbol: "HBL", name: "Habib Bank Limited", sector: "Commercial Banks",
    ceo: "Muhammad Ali", website: "https://hbl.com", registrar: "CDC", auditor: "A.F. Ferguson & Co.",
    sharesOutstanding: 1473000000, freeFloat: 55, marketCap: 176760000000,
    pe: 5.5, pb: 0.75, eps: 21.8, dividendYield: 0.062, roe: 0.16,
    revenue: 380000000000, profitAfterTax: 32000000000,
    currentPrice: 120, dayChange: 1.0, dayChangePercent: 0.84,
    week52High: 142, week52Low: 95, ytdChange: 6.3, year1Change: 10.5,
  },
  {
    symbol: "MCB", name: "MCB Bank Limited", sector: "Commercial Banks",
    ceo: "M. Naveed Anjum", website: "https://mcb.com.pk", registrar: "CDC", auditor: "KPMG",
    sharesOutstanding: 1185000000, freeFloat: 45, marketCap: 177750000000,
    pe: 6.1, pb: 0.9, eps: 24.5, dividendYield: 0.058, roe: 0.17,
    revenue: 220000000000, profitAfterTax: 29000000000,
    currentPrice: 150, dayChange: 2.5, dayChangePercent: 1.69,
    week52High: 168, week52Low: 122, ytdChange: 8.9, year1Change: 14.2,
  },
  {
    symbol: "UBL", name: "United Bank Limited", sector: "Commercial Banks",
    ceo: "Shazad Dada", website: "https://ubldigital.com", registrar: "CDC", auditor: "Ernst & Young",
    sharesOutstanding: 1224000000, freeFloat: 50, marketCap: 171360000000,
    pe: 5.8, pb: 0.85, eps: 22.1, dividendYield: 0.068, roe: 0.15,
    revenue: 210000000000, profitAfterTax: 27000000000,
    currentPrice: 140, dayChange: -1.0, dayChangePercent: -0.71,
    week52High: 158, week52Low: 110, ytdChange: 4.5, year1Change: 9.8,
  },
  {
    symbol: "FFC", name: "Fauji Fertilizer Company", sector: "Fertilizer",
    ceo: "Maj Gen (R) Hamid Raza", website: "https://ffc.com.pk", registrar: "FAMCO", auditor: "A.F. Ferguson & Co.",
    sharesOutstanding: 1272000000, freeFloat: 40, marketCap: 159000000000,
    pe: 7.2, pb: 1.6, eps: 17.3, dividendYield: 0.075, roe: 0.24,
    revenue: 190000000000, profitAfterTax: 22000000000,
    currentPrice: 125, dayChange: 0.5, dayChangePercent: 0.40,
    week52High: 148, week52Low: 98, ytdChange: 3.8, year1Change: 7.5,
  },
  {
    symbol: "EFERT", name: "Engro Fertilizers Limited", sector: "Fertilizer",
    ceo: "Ahsan Riaz", website: "https://engrofertilizers.com", registrar: "CDC", auditor: "KPMG",
    sharesOutstanding: 1333000000, freeFloat: 35, marketCap: 106640000000,
    pe: 8.5, pb: 1.8, eps: 9.4, dividendYield: 0.042, roe: 0.21,
    revenue: 160000000000, profitAfterTax: 12500000000,
    currentPrice: 80, dayChange: -0.8, dayChangePercent: -0.99,
    week52High: 98, week52Low: 62, ytdChange: -6.5, year1Change: 2.1,
  },
  {
    symbol: "ENGRO", name: "Engro Corporation Limited", sector: "Conglomerate",
    ceo: "Ahsan Z. Syed", website: "https://engro.com", registrar: "CDC", auditor: "KPMG",
    sharesOutstanding: 610000000, freeFloat: 55, marketCap: 189100000000,
    pe: 10.2, pb: 1.4, eps: 30.4, dividendYield: 0.038, roe: 0.15,
    revenue: 350000000000, profitAfterTax: 18500000000,
    currentPrice: 310, dayChange: 4.0, dayChangePercent: 1.31,
    week52High: 355, week52Low: 245, ytdChange: 11.2, year1Change: 18.5,
  },
  {
    symbol: "SYS", name: "Systems Limited", sector: "Technology",
    ceo: "Asif Peer", website: "https://systemsltd.com", registrar: "CDC", auditor: "A.F. Ferguson & Co.",
    sharesOutstanding: 290000000, freeFloat: 65, marketCap: 113100000000,
    pe: 18.5, pb: 5.2, eps: 21, dividendYield: 0.015, roe: 0.35,
    revenue: 42000000000, profitAfterTax: 6100000000,
    currentPrice: 390, dayChange: 8.5, dayChangePercent: 2.23,
    week52High: 445, week52Low: 280, ytdChange: 22.5, year1Change: 35.2,
  },
  {
    symbol: "TRG", name: "TRG Pakistan Limited", sector: "Technology",
    ceo: "Shafiq K. Qureshi", website: "https://trg.com", registrar: "FAMCO", auditor: "Grant Thornton",
    sharesOutstanding: 1240000000, freeFloat: 70, marketCap: 86800000000,
    pe: 25.2, pb: 3.8, eps: 2.78, dividendYield: 0, roe: 0.18,
    revenue: 58000000000, profitAfterTax: 3450000000,
    currentPrice: 70, dayChange: -1.2, dayChangePercent: -1.69,
    week52High: 95, week52Low: 48, ytdChange: -15.8, year1Change: 5.4,
  },
  {
    symbol: "NESTLE", name: "Nestlé Pakistan Limited", sector: "Food & Beverages",
    ceo: "Jason Avanzi", website: "https://nestle.pk", registrar: "CDC", auditor: "A.F. Ferguson & Co.",
    sharesOutstanding: 45340000, freeFloat: 40, marketCap: 317380000000,
    pe: 28.5, pb: 8.2, eps: 245, dividendYield: 0.025, roe: 0.32,
    revenue: 185000000000, profitAfterTax: 11100000000,
    currentPrice: 7000, dayChange: 50, dayChangePercent: 0.72,
    week52High: 7800, week52Low: 5800, ytdChange: 8.2, year1Change: 14.5,
  },
  {
    symbol: "PSO", name: "Pakistan State Oil Company", sector: "Oil Marketing",
    ceo: "Syed M. Taha", website: "https://psopk.com", registrar: "CDC", auditor: "Ernst & Young",
    sharesOutstanding: 469000000, freeFloat: 35, marketCap: 75040000000,
    pe: 3.5, pb: 0.55, eps: 45.7, dividendYield: 0.092, roe: 0.18,
    revenue: 2800000000000, profitAfterTax: 21400000000,
    currentPrice: 160, dayChange: -3.0, dayChangePercent: -1.84,
    week52High: 190, week52Low: 128, ytdChange: -2.5, year1Change: 6.8,
  },
  {
    symbol: "HUBC", name: "Hub Power Company Limited", sector: "Power Generation",
    ceo: "Rashid S. M.", website: "https://hubpower.com", registrar: "CDC", auditor: "A.F. Ferguson & Co.",
    sharesOutstanding: 1295000000, freeFloat: 50, marketCap: 142450000000,
    pe: 6.8, pb: 1.2, eps: 16.2, dividendYield: 0.082, roe: 0.22,
    revenue: 165000000000, profitAfterTax: 21000000000,
    currentPrice: 110, dayChange: 1.2, dayChangePercent: 1.10,
    week52High: 125, week52Low: 88, ytdChange: 7.8, year1Change: 11.4,
  },
  {
    symbol: "INDU", name: "Indus Motor Company Limited", sector: "Automobile",
    ceo: "Ali A. H. Jamali", website: "https://toyota-indus.com", registrar: "CDC", auditor: "KPMG",
    sharesOutstanding: 78500000, freeFloat: 35, marketCap: 109900000000,
    pe: 11.2, pb: 2.8, eps: 125, dividendYield: 0.055, roe: 0.28,
    revenue: 320000000000, profitAfterTax: 9800000000,
    currentPrice: 1400, dayChange: -15, dayChangePercent: -1.06,
    week52High: 1680, week52Low: 1100, ytdChange: -5.8, year1Change: 3.2,
  },
  {
    symbol: "SEARL", name: "Searle Pakistan Limited", sector: "Pharmaceuticals",
    ceo: "M. Shoaib Khan", website: "https://searle.com.pk", registrar: "CDC", auditor: "Grant Thornton",
    sharesOutstanding: 505000000, freeFloat: 55, marketCap: 27775000000,
    pe: 14.5, pb: 2.1, eps: 3.8, dividendYield: 0.018, roe: 0.16,
    revenue: 28000000000, profitAfterTax: 1900000000,
    currentPrice: 55, dayChange: 0.6, dayChangePercent: 1.10,
    week52High: 72, week52Low: 42, ytdChange: -12.5, year1Change: -8.5,
  },
  {
    symbol: "GLAXO", name: "GlaxoSmithKline Pakistan", sector: "Pharmaceuticals",
    ceo: "Rashid M.", website: "https://gsk.com.pk", registrar: "FAMCO", auditor: "A.F. Ferguson & Co.",
    sharesOutstanding: 118800000, freeFloat: 25, marketCap: 83160000000,
    pe: 22.5, pb: 5.5, eps: 31.1, dividendYield: 0.045, roe: 0.28,
    revenue: 52000000000, profitAfterTax: 3700000000,
    currentPrice: 700, dayChange: 5.0, dayChangePercent: 0.72,
    week52High: 780, week52Low: 580, ytdChange: 6.8, year1Change: 12.5,
  },
  {
    symbol: "ABOT", name: "Abbott Laboratories Pakistan", sector: "Pharmaceuticals",
    ceo: "M. Asif", website: "https://abbott.com.pk", registrar: "CDC", auditor: "KPMG",
    sharesOutstanding: 105900000, freeFloat: 30, marketCap: 105900000000,
    pe: 20.8, pb: 4.8, eps: 48.1, dividendYield: 0.038, roe: 0.25,
    revenue: 48000000000, profitAfterTax: 5100000000,
    currentPrice: 1000, dayChange: -8.0, dayChangePercent: -0.79,
    week52High: 1150, week52Low: 820, ytdChange: 5.2, year1Change: 9.8,
  },
  {
    symbol: "COLG", name: "Colgate-Palmolive Pakistan", sector: "Consumer Goods",
    ceo: "M. E. S. Qureshi", website: "https://colgate.com.pk", registrar: "CDC", auditor: "A.F. Ferguson & Co.",
    sharesOutstanding: 162900000, freeFloat: 25, marketCap: 228060000000,
    pe: 26.5, pb: 8.5, eps: 52.9, dividendYield: 0.048, roe: 0.38,
    revenue: 65000000000, profitAfterTax: 8600000000,
    currentPrice: 1400, dayChange: 10, dayChangePercent: 0.72,
    week52High: 1550, week52Low: 1150, ytdChange: 9.5, year1Change: 16.8,
  },
  {
    symbol: "PSMC", name: "Pak Suzuki Motor Company", sector: "Automobile",
    ceo: "Shigeki N.", website: "https://paksuzuki.com.pk", registrar: "FAMCO", auditor: "Ernst & Young",
    sharesOutstanding: 116400000, freeFloat: 30, marketCap: 11640000000,
    pe: 35.2, pb: 0.9, eps: 2.85, dividendYield: 0, roe: 0.03,
    revenue: 180000000000, profitAfterTax: 332000000,
    currentPrice: 100, dayChange: -2.5, dayChangePercent: -2.44,
    week52High: 145, week52Low: 75, ytdChange: -18.5, year1Change: -25.8,
  },
];

const PRICE_HISTORY_DAYS = 365;

function generatePriceHistory(basePrice, volatility = 0.02, trend = 0.0002) {
  const history = [];
  let price = basePrice;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - PRICE_HISTORY_DAYS);

  for (let i = 0; i < PRICE_HISTORY_DAYS; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 5 || date.getDay() === 6) continue;

    const change = price * (trend + (Math.random() - 0.5) * volatility * 2);
    const open = price;
    const close = Math.max(open + change, basePrice * 0.2);
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);
    const volume = Math.floor(500000 + Math.random() * 5000000);

    history.push({ date, open: Math.round(open * 100) / 100, high: Math.round(high * 100) / 100, low: Math.round(low * 100) / 100, close: Math.round(close * 100) / 100, volume });
    price = close;
  }
  return history;
}

export function getMockData() {
  return COMPANIES.map((c) => ({
    ...c,
    priceHistory: generatePriceHistory(c.currentPrice, 0.025, 0.0001),
  }));
}

export const mockCompanies = COMPANIES;
