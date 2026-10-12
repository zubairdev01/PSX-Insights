import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import companyRoutes from "./routes/companies.js";
import dividendRoutes from "./routes/dividends.js";
import indexRoutes from "./routes/indices.js";
import analysisRoutes from "./routes/analysis.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "PSX Insight API",
    status: "ok",
    message: "Use /api/health for server health checks.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/dividends", dividendRoutes);
app.use("/api/indices", indexRoutes);
app.use("/api/analysis", analysisRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
