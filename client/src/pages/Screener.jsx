import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import Card from "../components/Card";
import Input from "../components/Input";
import Badge from "../components/Badge";
import Skeleton from "../components/Skeleton";

export default function Screener() {
  const [companies, setCompanies] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [peMin, setPeMin] = useState("");
  const [peMax, setPeMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortKey, setSortKey] = useState("symbol");
  const [sortDir, setSortDir] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/companies").then((r) => setCompanies(r.data)),
      api.get("/companies/sectors").then((r) => setSectors(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <span style={{ opacity: 0.25, marginLeft: 4, fontSize: "0.7rem" }}>\u2195</span>;
    return <span style={{ marginLeft: 4, fontSize: "0.7rem", color: "var(--blue)" }}>{sortDir === "asc" ? "\u2191" : "\u2193"}</span>;
  };

  const filtered = useMemo(() => {
    let result = companies.filter((c) => {
      if (sectorFilter && c.sector !== sectorFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.symbol.toLowerCase().includes(q) && !c.name.toLowerCase().includes(q)) return false;
      }
      if (peMin && (c.pe == null || c.pe < parseFloat(peMin))) return false;
      if (peMax && (c.pe == null || c.pe > parseFloat(peMax))) return false;
      if (priceMin && (c.currentPrice == null || c.currentPrice < parseFloat(priceMin))) return false;
      if (priceMax && (c.currentPrice == null || c.currentPrice > parseFloat(priceMax))) return false;
      return true;
    });

    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [companies, search, sectorFilter, peMin, peMax, priceMin, priceMax, sortKey, sortDir]);

  const clearFilters = () => {
    setSearch("");
    setSectorFilter("");
    setPeMin("");
    setPeMax("");
    setPriceMin("");
    setPriceMax("");
  };

  const hasFilters = search || sectorFilter || peMin || peMax || priceMin || priceMax;

  if (loading) {
    return (
      <div>
        <div className="page-header"><h1>Screener</h1><p>Browse all PSX companies</p></div>
        <Skeleton height={400} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Screener</h1>
          <p>{companies.length} companies listed on PSX</p>
        </div>
        {hasFilters && (
          <button className="btn btn-sm btn-ghost" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <Input
            placeholder="Search symbol or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <Input type="number" placeholder="P/E min" value={peMin} onChange={(e) => setPeMin(e.target.value)} style={{ width: 100 }} />
          <Input type="number" placeholder="P/E max" value={peMax} onChange={(e) => setPeMax(e.target.value)} style={{ width: 100 }} />
          <Input type="number" placeholder="Price min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} style={{ width: 110 }} />
          <Input type="number" placeholder="Price max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} style={{ width: 110 }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            className={`filter-pill ${sectorFilter === "" ? "active" : ""}`}
            onClick={() => setSectorFilter("")}
          >
            All
          </button>
          {sectors.slice(0, 10).map((s) => (
            <button
              key={s}
              className={`filter-pill ${sectorFilter === s ? "active" : ""}`}
              onClick={() => setSectorFilter(sectorFilter === s ? "" : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {filtered.length} of {companies.length} companies
          </span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th className="sort-header" onClick={() => handleSort("symbol")}>
                  Symbol <SortIcon k="symbol" />
                </th>
                <th className="sort-header" onClick={() => handleSort("name")}>
                  Name <SortIcon k="name" />
                </th>
                <th className="sort-header" onClick={() => handleSort("sector")}>
                  Sector <SortIcon k="sector" />
                </th>
                <th className="sort-header" onClick={() => handleSort("currentPrice")}>
                  Price <SortIcon k="currentPrice" />
                </th>
                <th className="sort-header" onClick={() => handleSort("pe")}>
                  P/E <SortIcon k="pe" />
                </th>
                <th className="sort-header" onClick={() => handleSort("marketCap")}>
                  Mkt Cap <SortIcon k="marketCap" />
                </th>
                <th className="sort-header" onClick={() => handleSort("dividendYield")}>
                  Div Yield <SortIcon k="dividendYield" />
                </th>
                <th className="sort-header" onClick={() => handleSort("eps")}>
                  EPS <SortIcon k="eps" />
                </th>
                <th>30d</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/stock/${c.symbol}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td><Link to={`/stock/${c.symbol}`} style={{ fontWeight: 600 }} onClick={(e) => e.stopPropagation()}>{c.symbol}</Link></td>
                  <td style={{ fontSize: "0.85rem" }}>{c.name}</td>
                  <td><Badge>{c.sector || "\u2014"}</Badge></td>
                  <td className="tabular">{c.currentPrice ? `PKR ${c.currentPrice.toLocaleString()}` : "\u2014"}</td>
                  <td className="tabular">{c.pe?.toFixed(2) || "\u2014"}</td>
                  <td className="tabular">{c.marketCap ? `PKR ${(c.marketCap / 1e8).toFixed(2)}B` : "\u2014"}</td>
                  <td style={{ color: "var(--green)" }} className="tabular">{c.dividendYield ? `${(c.dividendYield * 100).toFixed(2)}%` : "\u2014"}</td>
                  <td className="tabular">{c.eps != null ? `PKR ${c.eps.toFixed(2)}` : "\u2014"}</td>
                  <td>
                    <SparklineBar change={c.dayChangePercent} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>
                  No companies match your filters
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SparklineBar({ change }) {
  if (change == null) return <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>\u2014</span>;
  const isUp = change >= 0;
  const color = isUp ? "var(--green)" : "var(--red)";
  const height = Math.min(Math.abs(change) * 3, 32);
  return (
    <svg width="40" height="20" viewBox="0 0 40 20" style={{ display: "block" }}>
      {isUp ? (
        <polyline points="0,18 10,14 20,10 30,6 40,2" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <polyline points="0,2 10,6 20,10 30,14 40,18" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {isUp ? (
        <polygon points="34,0 40,2 36,6" fill={color} />
      ) : (
        <polygon points="34,20 40,18 36,14" fill={color} />
      )}
    </svg>
  );
}
