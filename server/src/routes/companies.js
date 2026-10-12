import { Router } from "express";
import { dbProvider } from "../services/dbProvider.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { sector, search } = req.query;
    const companies = await dbProvider.getCompanies({ sector, search });
    res.json(companies);
  } catch (err) {
    next(err);
  }
});

router.get("/sectors", async (req, res, next) => {
  try {
    const sectors = await dbProvider.getSectors();
    res.json(sectors);
  } catch (err) {
    next(err);
  }
});

router.get("/:symbol", async (req, res, next) => {
  try {
    const company = await dbProvider.getCompany(req.params.symbol);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    next(err);
  }
});

export default router;
