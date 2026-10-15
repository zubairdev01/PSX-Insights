import { Router } from "express";
import prisma from "../utils/prisma.js";

const router = Router();

async function getCompanyData(symbol) {
  return prisma.company.findUnique({
    where: { symbol: symbol.toUpperCase() },
    include: { priceHistory: { orderBy: { date: "desc" }, take: 365 } },
  });
}

function buildSummaryPrompt(company) {
  return `You are a stock analysis assistant. Given the following structured data for a Pakistan Stock Exchange company, return a JSON object with these exact keys (no markdown, no extra text, only valid JSON):

{
  "businessModel": "string - what the company does",
  "marketSnapshot": { "marketCap": "string", "pe": "number or null", "week52Range": "string", "year1Change": "string", "ytdChange": "string" },
  "financials": { "revenue": "string", "profitAfterTax": "string", "eps": "string" },
  "overview": { "ceo": "string or null", "sector": "string or null", "sharesOutstanding": "string", "freeFloat": "string or null" },
  "performance": { "week52High": "string", "week52Low": "string", "year1Change": "string", "ytdChange": "string" },
  "summary": "string - 2-3 sentence bottom-line summary"
}

IMPORTANT: Use ONLY the figures provided below. Do not hallucinate numbers.

Company data:
Symbol: ${company.symbol}
Name: ${company.name}
Sector: ${company.sector || "N/A"}
CEO: ${company.ceo || "N/A"}
Website: ${company.website || "N/A"}
Registrar: ${company.registrar || "N/A"}
Auditor: ${company.auditor || "N/A"}
Shares Outstanding: ${company.sharesOutstanding || "N/A"}
Free Float: ${company.freeFloat || "N/A"}%
Market Cap: PKR ${(company.marketCap || 0).toLocaleString()}
Current Price: PKR ${(company.currentPrice || 0).toLocaleString()}
P/E Ratio: ${company.pe || "N/A"}
P/B Ratio: ${company.pb || "N/A"}
EPS: PKR ${company.eps || "N/A"}
Dividend Yield: ${company.dividendYield != null ? (company.dividendYield * 100).toFixed(2) + "%" : "N/A"}
ROE: ${company.roe != null ? (company.roe * 100).toFixed(2) + "%" : "N/A"}
Revenue: PKR ${(company.revenue || 0).toLocaleString()}
Profit After Tax: PKR ${(company.profitAfterTax || 0).toLocaleString()}
52-Week High: PKR ${(company.week52High || 0).toLocaleString()}
52-Week Low: PKR ${(company.week52Low || 0).toLocaleString()}
1-Year Change: ${company.year1Change || "N/A"}%
YTD Change: ${company.ytdChange || "N/A"}%`;
}

function buildProjectionPrompt(company) {
  return `You are a financial analysis assistant. Given the following data for a PSX-listed company, return a JSON object with these exact keys (only valid JSON, no markdown):

{
  "targetPriceRange": { "low": "number", "high": "number", "currentPrice": "number" },
  "shortTermOutlook": "string - 2-3 sentence short-term (3-6 month) outlook",
  "longTermOutlook": "string - 2-3 sentence long-term (1-3 year) outlook",
  "keyDrivers": ["string - 3-5 key drivers"],
  "levelsToWatch": { "support": "number or null", "resistance": "number or null" }
}

Use only the data provided. Clearly label this as an AI-generated estimate.

Company: ${company.symbol} - ${company.name}
Current Price: ${company.currentPrice}
P/E: ${company.pe}
EPS: ${company.eps}
52-Week Range: ${company.week52Low} - ${company.week52High}
Sector: ${company.sector}
Revenue: ${company.revenue}
Profit After Tax: ${company.profitAfterTax}`;
}

function buildRiskPrompt(company) {
  return `You are a risk analysis assistant. Given the following data for a PSX-listed company, return a JSON object with these exact keys (only valid JSON, no markdown):

{
  "overview": "string - 1-2 sentence key risk overview",
  "specificRisks": [{ "factor": "string", "description": "string", "severity": "low|medium|high" }],
  "downsideLevels": { "fiftyTwoWeekLowImpact": "string - if stock drops to 52w low", "stressScenario": "string" },
  "marketContext": "string - broader market correlation context"
}

Company: ${company.symbol} - ${company.name}
Sector: ${company.sector}
Current Price: ${company.currentPrice}
52-Week Low: ${company.week52Low}
52-Week High: ${company.week52High}
P/E: ${company.pe}
Debt/Equity indicator - ROE: ${company.roe}
Revenue: ${company.revenue}
Profit After Tax: ${company.profitAfterTax}
EPS: ${company.eps}
Dividend Yield: ${company.dividendYield}
1-Year Change: ${company.year1Change}%`;
}

async function callLLM(prompt) {
  const configuredProvider = process.env.AI_PROVIDER?.toLowerCase();
  if (configuredProvider === "ollama") {
    const baseUrl = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "qwen2.5:7b",
        stream: false,
        format: "json",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!response.ok) {
      const error = new Error(`Ollama request failed (${response.status}): ${await response.text()}`);
      error.status = 502;
      throw error;
    }
    const data = await response.json();
    if (typeof data.message?.content !== "string" || !data.message.content.trim()) {
      const error = new Error("Ollama returned an empty or invalid response");
      error.status = 502;
      throw error;
    }
    return JSON.parse(data.message.content);
  }
  if (configuredProvider && !["openai", "anthropic"].includes(configuredProvider)) {
    const error = new Error(`Unsupported AI_PROVIDER "${configuredProvider}". Use ollama, openai, or anthropic.`);
    error.status = 503;
    throw error;
  }
  const useAnthropic = configuredProvider === "anthropic" ||
    (!configuredProvider && !process.env.OPENAI_API_KEY);
  const apiKey = useAnthropic ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error(`Missing ${useAnthropic ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY"} for the selected AI provider`);
    error.status = 503;
    throw error;
  }
  if (useAnthropic) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    return JSON.parse(data.content[0].text);
  } else {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
      }),
    });
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  }
}

router.post("/summary/:symbol", async (req, res, next) => {
  try {
    const company = await getCompanyData(req.params.symbol);
    if (!company) return res.status(404).json({ error: "Company not found" });
    const prompt = buildSummaryPrompt(company);
    const result = await callLLM(prompt);
    res.json({ symbol: company.symbol, name: company.name, ...result, disclaimer: "AI-generated estimate for informational purposes only." });
  } catch (err) {
    next(err);
  }
});

router.post("/projection/:symbol", async (req, res, next) => {
  try {
    const company = await getCompanyData(req.params.symbol);
    if (!company) return res.status(404).json({ error: "Company not found" });
    const prompt = buildProjectionPrompt(company);
    const result = await callLLM(prompt);
    res.json({ symbol: company.symbol, name: company.name, ...result, disclaimer: "This is an AI-generated estimate for informational purposes only and is not financial advice." });
  } catch (err) {
    next(err);
  }
});

router.post("/risk/:symbol", async (req, res, next) => {
  try {
    const company = await getCompanyData(req.params.symbol);
    if (!company) return res.status(404).json({ error: "Company not found" });
    const prompt = buildRiskPrompt(company);
    const result = await callLLM(prompt);
    res.json({ symbol: company.symbol, name: company.name, ...result, disclaimer: "AI-generated risk assessment for informational purposes only." });
  } catch (err) {
    next(err);
  }
});

export default router;
