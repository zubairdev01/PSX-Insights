import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Skeleton from "../components/Skeleton";
import CandlestickChart from "../components/CandlestickChart";

const TIMEFRAMES = ["1M", "3M", "6M", "1Y", "ALL"];

export default function StockProfile() {
  const { symbol } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tf, setTf] = useState("1Y");

  useEffect(() => {
    setLoading(true);
    api.get(`/companies/${symbol}`).then((res) => {
      setCompany(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [symbol]);

  const chartData = useMemo(() => {
    if (!company?.priceHistory) return [];
    const all = company.priceHistory.map((p) => ({
      time: Math.floor(new Date(p.date).getTime() / 1000),
      open: p.open,
      high: p.high,
      low: p.low,
      close: p.close,
    }));
    if (tf === "ALL") return all;
    const cut = Date.now() / 1000 - { "1M": 30, "3M": 90, "6M": 180, "1Y": 365 }[tf] * 86400;
    return all.filter((d) => d.time >= cut);
  }, [company, tf]);

  if (loading) {
    return (
      <div>
        <div className="page-header"><h1>{symbol}</h1></div>
        <Skeleton height={400} style={{ marginBottom: 24 }} />
        <div className="stats-grid">
          {[1,2,3,4,5,6].map(i => <Card key={i} hover={false}><Skeleton height={80} /></Card>)}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <Card style={{ textAlign: "center", padding: 48 }}>
        <p>Company not found</p>
      </Card>
    );
  }

  const currentPrice = company.currentPrice || 0;
  const dayChange = company.dayChangePercent || 0;
  const marketCap = company.marketCap || 0;
  const pe = company.pe;
  const eps = company.eps;
  const divYield = company.dividendYield;

  return (
    <div>
      <div className="page-header" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ marginBottom: 0 }}>{company.symbol}</h1>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{company.name}</span>
        </div>
        {company.sector && <Badge>{company.sector}</Badge>}
        <Link to={`/analysis/${company.symbol}`} style={{ marginLeft: "auto" }}>
          <Button size="sm">AI Analysis</Button>
        </Link>
      </div>

      <div className="stats-grid">
        <Card className="stat-card" hover={false}>
          <div className="stat-label">Current Price</div>
          <div className="stat-value">PKR {currentPrice.toLocaleString()}</div>
          <div style={{ marginTop: 6 }}>
            <span className={`change-pill ${dayChange >= 0 ? "gain" : "loss"}`}>
              <span>{dayChange >= 0 ? "\u2191" : "\u2193"}</span>
              {dayChange >= 0 ? "+" : ""}{dayChange}%
            </span>
          </div>
        </Card>
        <Card className="stat-card" hover={false}>
          <div className="stat-label">Market Cap</div>
          <div className="stat-value">{marketCap > 0 ? `PKR ${(marketCap / 1e8).toFixed(2)}B` : "\u2014"}</div>
        </Card>
        <Card className="stat-card" hover={false}>
          <div className="stat-label">P/E</div>
          <div className="stat-value">{pe != null ? pe.toFixed(2) : "\u2014"}</div>
        </Card>
        <Card className="stat-card" hover={false}>
          <div className="stat-label">EPS</div>
          <div className="stat-value">{eps != null ? `PKR ${eps.toFixed(2)}` : "\u2014"}</div>
        </Card>
        <Card className="stat-card" hover={false}>
          <div className="stat-label">Div Yield</div>
          <div className="stat-value">{divYield != null ? `${(divYield * 100).toFixed(2)}%` : "\u2014"}</div>
        </Card>
        <Card className="stat-card" hover={false}>
          <div className="stat-label">P/B</div>
          <div className="stat-value">{company.pb?.toFixed(2) || "\u2014"}</div>
        </Card>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: "0.95rem" }}>Price Chart</h3>
          <div style={{ display: "flex", gap: 4 }}>
            {TIMEFRAMES.map((t) => (
              <button
                key={t}
                className={`btn btn-sm ${tf === t ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTf(t)}
                style={{ borderRadius: 8, padding: "4px 12px", fontSize: "0.75rem" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {chartData.length > 0 ? (
          <CandlestickChart data={chartData} height={380} />
        ) : (
          <div style={{ height: 380, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            No price data available
          </div>
        )}
      </Card>

      <div className="grid-2col">
        <Card>
          <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Company Overview</h3>
          <table>
            <tbody>
              {company.ceo && <tr><td style={{ color: "var(--text-secondary)", width: 140, padding: "8px 0" }}>CEO</td><td style={{ padding: "8px 0" }}>{company.ceo}</td></tr>}
              {company.website && <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>Website</td><td style={{ padding: "8px 0" }}><a href={company.website} target="_blank" rel="noreferrer">{company.website}</a></td></tr>}
              {company.registrar && <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>Registrar</td><td style={{ padding: "8px 0" }}>{company.registrar}</td></tr>}
              {company.auditor && <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>Auditor</td><td style={{ padding: "8px 0" }}>{company.auditor}</td></tr>}
              {company.sharesOutstanding && <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>Shares Out.</td><td style={{ padding: "8px 0" }}>{(company.sharesOutstanding / 1e6).toFixed(1)}M</td></tr>}
              {company.freeFloat && <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>Free Float</td><td style={{ padding: "8px 0" }}>{company.freeFloat}%</td></tr>}
              <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>Sector</td><td style={{ padding: "8px 0" }}>{company.sector || "\u2014"}</td></tr>
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Performance</h3>
          <table>
            <tbody>
              <tr><td style={{ color: "var(--text-secondary)", width: 140, padding: "8px 0" }}>52-Week High</td><td style={{ padding: "8px 0", fontWeight: 600 }}>PKR {company.week52High?.toLocaleString() || "\u2014"}</td></tr>
              <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>52-Week Low</td><td style={{ padding: "8px 0", fontWeight: 600 }}>PKR {company.week52Low?.toLocaleString() || "\u2014"}</td></tr>
              <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>52-Week Range</td>
                <td style={{ padding: "8px 0" }}>
                  {company.week52High && company.week52Low ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>PKR {company.week52Low.toLocaleString()}</span>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--card-bg)", overflow: "hidden" }}>
                        <div style={{ width: `${((currentPrice - company.week52Low) / (company.week52High - company.week52Low)) * 100}%`, height: "100%", background: "var(--blue)", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>PKR {company.week52High.toLocaleString()}</span>
                    </div>
                  ) : "\u2014"}
                </td>
              </tr>
              <tr>
                <td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>1-Year Change</td>
                <td style={{ padding: "8px 0" }}>
                  <span className={`change-pill ${(company.year1Change || 0) >= 0 ? "gain" : "loss"}`}>
                    <span>{(company.year1Change || 0) >= 0 ? "\u2191" : "\u2193"}</span>
                    {company.year1Change != null ? `${company.year1Change >= 0 ? "+" : ""}${company.year1Change}%` : "\u2014"}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>YTD Change</td>
                <td style={{ padding: "8px 0" }}>
                  <span className={`change-pill ${(company.ytdChange || 0) >= 0 ? "gain" : "loss"}`}>
                    <span>{(company.ytdChange || 0) >= 0 ? "\u2191" : "\u2193"}</span>
                    {company.ytdChange != null ? `${company.ytdChange >= 0 ? "+" : ""}${company.ytdChange}%` : "\u2014"}
                  </span>
                </td>
              </tr>
              <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>ROE</td><td style={{ padding: "8px 0" }}>{company.roe != null ? `${(company.roe * 100).toFixed(2)}%` : "\u2014"}</td></tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
