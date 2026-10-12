import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, Tooltip as ReTooltip } from "recharts";
import api from "../api/client";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { StatsSkeleton } from "../components/Skeleton";
import { useTheme } from "../context/ThemeContext";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16"];

export default function Dashboard() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dark } = useTheme();

  useEffect(() => {
    api.get("/portfolio").then((res) => {
      setHoldings(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Portfolio overview</p>
      </div>

      {loading ? (
        <StatsSkeleton />
      ) : (
        <PortfolioStats holdings={holdings} />
      )}

      {!loading && holdings.length === 0 && (
        <Card style={{ textAlign: "center", padding: "48px 24px" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>No holdings yet</p>
          <Link to="/portfolio"><Button variant="primary">Add Holdings</Button></Link>
        </Card>
      )}

      {!loading && holdings.length > 0 && (
        <>
          <div className="grid-2col">
            <Card>
              <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Portfolio Performance</h3>
              <PortfolioChart holdings={holdings} dark={dark} />
            </Card>
            <Card>
              <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Sector Allocation</h3>
              <AllocationChart holdings={holdings} />
            </Card>
          </div>

          <div className="grid-2col" style={{ marginBottom: 32 }}>
            <Card>
              <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Top Gainers</h3>
              <MoversList holdings={holdings} type="gainers" />
            </Card>
            <Card>
              <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Top Losers</h3>
              <MoversList holdings={holdings} type="losers" />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function PortfolioStats({ holdings }) {
  const totalValue = holdings.reduce((s, h) => s + (h.marketValue || 0), 0);
  const totalCost = holdings.reduce((s, h) => s + (h.costBasis || 0), 0);
  const totalPnl = totalValue - totalCost;
  const totalDayChange = holdings.reduce((s, h) => {
    return s + ((h.dayChange || 0) * h.quantity);
  }, 0);
  const dayChangePercent = totalValue > 0 ? (totalDayChange / (totalValue - totalDayChange)) * 100 : 0;

  return (
    <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
      <Card className="stat-card">
        <div className="stat-label">Total Holdings Value</div>
        <div className="stat-value" style={{ fontSize: "1.8rem", marginTop: 4 }}>
          PKR {totalValue.toLocaleString()}
        </div>
        <div className="stat-change" style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 8 }}>
          {holdings.length} holdings
        </div>
      </Card>
      <Card className="stat-card">
        <div className="stat-label">Day Change</div>
        <div className="stat-value" style={{ fontSize: "1.8rem", marginTop: 4, color: dayChangePercent >= 0 ? "var(--green)" : "var(--red)" }}>
          {dayChangePercent >= 0 ? "+" : ""}{dayChangePercent.toFixed(2)}%
        </div>
        <span className={`change-pill ${dayChangePercent >= 0 ? "gain" : "loss"}`} style={{ marginTop: 8 }}>
          <span>{dayChangePercent >= 0 ? "\u2191" : "\u2193"}</span>
          PKR {Math.abs(totalDayChange).toLocaleString()}
        </span>
      </Card>
      <Card className="stat-card">
        <div className="stat-label">Unrealized P&L</div>
        <div className="stat-value" style={{ fontSize: "1.8rem", marginTop: 4, color: totalPnl >= 0 ? "var(--green)" : "var(--red)" }}>
          {totalPnl >= 0 ? "+" : ""}PKR {totalPnl.toLocaleString()}
        </div>
        <span className={`change-pill ${totalPnl >= 0 ? "gain" : "loss"}`} style={{ marginTop: 8 }}>
          <span>{totalPnl >= 0 ? "\u2191" : "\u2193"}</span>
          {totalValue > 0 ? ((totalPnl / totalCost) * 100).toFixed(2) : 0}%
        </span>
      </Card>
    </div>
  );
}

function PortfolioChart({ holdings, dark }) {
  const totalValue = holdings.reduce((s, h) => s + (h.marketValue || 0), 0);
  const totalPnl = totalValue - holdings.reduce((s, h) => s + (h.costBasis || 0), 0);
  const isPositive = totalPnl >= 0;
  const chartColor = isPositive ? "#10B981" : "#EF4444";

  const data = holdings.map((h) => ({
    name: h.symbol,
    value: h.marketValue || 0,
  }));

  const textColor = dark ? "#8b93a3" : "#667";

  if (data.length === 0) {
    return <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>No data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={chartColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <ReTooltip
          contentStyle={{
            background: dark ? "rgba(30,32,44,0.9)" : "rgba(255,255,255,0.9)",
            border: "1px solid var(--card-border)",
            borderRadius: 12,
            backdropFilter: "blur(8px)",
            fontSize: "0.8rem",
          }}
          formatter={(v) => [`PKR ${Number(v).toLocaleString()}`, "Value"]}
        />
        <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fill="url(#perfGrad)" dot={false} activeDot={{ r: 4, fill: chartColor }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function AllocationChart({ holdings }) {
  const sectorMap = {};
  holdings.forEach((h) => {
    const sector = h.sector || "Other";
    sectorMap[sector] = (sectorMap[sector] || 0) + (h.marketValue || 0);
  });
  const data = Object.entries(sectorMap).map(([name, value]) => ({ name, value }));
  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>No data</div>;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={2} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 120 }}>
        {data.slice(0, 6).map((d, i) => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            <span style={{ flex: 1, fontWeight: 500 }}>{d.name}</span>
            <span style={{ color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
              {total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoversList({ holdings, type }) {
  const items = holdings
    .filter((h) => h.dayChangePercent !== 0 && h.dayChangePercent != null)
    .filter((h) => type === "gainers" ? h.dayChangePercent > 0 : h.dayChangePercent < 0)
    .sort((a, b) => type === "gainers"
      ? (b.dayChangePercent || 0) - (a.dayChangePercent || 0)
      : (a.dayChangePercent || 0) - (b.dayChangePercent || 0)
    )
    .slice(0, 5);

  if (items.length === 0) {
    return <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "8px 0" }}>No {type} today</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((h) => {
        const change = h.dayChangePercent || 0;
        return (
          <Link
            key={h.id}
            to={`/stock/${h.symbol}`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 8px", borderRadius: 12, textDecoration: "none", color: "inherit",
              transition: "background var(--transition)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--card-bg-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{h.symbol}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                PKR {Number(h.currentPrice).toLocaleString()}
              </div>
            </div>
            <span className={`change-pill ${change >= 0 ? "gain" : "loss"}`}>
              <span>{change >= 0 ? "\u2191" : "\u2193"}</span>
              {change >= 0 ? "+" : ""}{change.toFixed(2)}%
            </span>
          </Link>
        );
      })}
    </div>
  );
}
