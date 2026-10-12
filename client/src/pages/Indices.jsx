import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area,
} from "recharts";
import api from "../api/client";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Skeleton from "../components/Skeleton";
import { useTheme } from "../context/ThemeContext";

export default function Indices() {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mutualFunds, setMutualFunds] = useState([]);
  const { dark } = useTheme();

  useEffect(() => {
    api.get("/indices").then((res) => {
      const data = res.data;
      const idx = data.filter((d) => d.name !== "Mutual Fund Watchlist" && !d.category);
      const funds = data.filter((d) => d.category || d.name === "Mutual Fund Watchlist").flatMap((d) => d.funds || []);
      setIndices(idx);
      setMutualFunds(funds.length > 0 ? funds : data.filter((d) => d.category));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header"><h1>Indices</h1><p>KSE-100, KSE-30 & mutual fund NAV</p></div>
        <Skeleton height={400} />
      </div>
    );
  }

  const gridColor = dark ? "rgba(255,255,255,0.06)" : "rgba(20,20,40,0.06)";
  const textColor = dark ? "#8b93a3" : "#667";

  const kse100 = indices.find((i) => i.name?.includes("KSE-100") || i.name === "KSE-100");
  const kse30 = indices.find((i) => i.name?.includes("KSE-30") || i.name === "KSE-30");
  const otherIndices = indices.filter((i) => i !== kse100 && i !== kse30);

  const buildChartData = (idx) =>
    idx?.data?.map((d) => ({
      time: new Date(d.date).toLocaleDateString(),
      value: d.value,
    })) || [];

  const chartData100 = buildChartData(kse100);
  const chartData30 = buildChartData(kse30);

  const chartConfig = (data, color) => ({
    data,
    gradientId: `grad_${color.replace('#', '')}`,
    color,
  });

  return (
    <div>
      <div className="page-header">
        <h1>Indices</h1>
        <p>KSE-100, KSE-30 & mutual fund NAV tracking</p>
      </div>

      {indices.length === 0 && mutualFunds.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <p style={{ color: "var(--text-secondary)" }}>No index data available. Run the seed script.</p>
        </Card>
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            {[...indices, ...(mutualFunds.length > 0 ? [{ name: "Mutual Funds", currentValue: mutualFunds.length, changePercent: 0, ytdChange: 0, isFundCount: true }] : [])].map((i, idx) => (
              <Card
                key={i.name || idx}
                hover={true}
                style={{ flex: 1, minWidth: 180, cursor: "default" }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                  {i.isFundCount ? "Mutual Funds Tracked" : i.name}
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, fontFamily: "'Manrope', system-ui, sans-serif", fontVariantNumeric: "tabular-nums" }}>
                  {i.isFundCount ? i.currentValue : i.currentValue?.toLocaleString()}
                </div>
                {!i.isFundCount && (
                  <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
                    <Badge variant={(i.changePercent || 0) >= 0 ? "gain" : "loss"}>
                      <span>{(i.changePercent || 0) >= 0 ? "\u2191" : "\u2193"}</span>
                      {(i.changePercent || 0) >= 0 ? "+" : ""}{i.changePercent?.toFixed(2)}%
                    </Badge>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      YTD: {(i.ytdChange || 0) >= 0 ? "+" : ""}{i.ytdChange?.toFixed(2)}%
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {(chartData100.length > 0 || chartData30.length > 0) && (
            <div className="grid-2col">
              {chartData100.length > 0 && (
                <Card>
                  <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>KSE-100</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData100}>
                      <defs>
                        <linearGradient id="gradKse100" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="time" tick={{ fontSize: 10, fill: textColor }} tickLine={false} axisLine={{ stroke: gridColor }} interval="preserveStartEnd" />
                      <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: textColor }} tickLine={false} axisLine={{ stroke: gridColor }} tickFormatter={(v) => v.toLocaleString()} />
                      <Tooltip
                        contentStyle={{
                          background: dark ? "rgba(30,32,44,0.9)" : "rgba(255,255,255,0.9)",
                          border: "1px solid var(--card-border)",
                          borderRadius: 12,
                          backdropFilter: "blur(8px)",
                          fontSize: "0.8rem",
                        }}
                        formatter={(v) => [v.toLocaleString(), "KSE-100"]}
                      />
                      <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="url(#gradKse100)" dot={false} activeDot={{ r: 4, fill: "#3B82F6" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              )}
              {chartData30.length > 0 && (
                <Card>
                  <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>KSE-30</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData30}>
                      <defs>
                        <linearGradient id="gradKse30" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="time" tick={{ fontSize: 10, fill: textColor }} tickLine={false} axisLine={{ stroke: gridColor }} interval="preserveStartEnd" />
                      <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: textColor }} tickLine={false} axisLine={{ stroke: gridColor }} tickFormatter={(v) => v.toLocaleString()} />
                      <Tooltip
                        contentStyle={{
                          background: dark ? "rgba(30,32,44,0.9)" : "rgba(255,255,255,0.9)",
                          border: "1px solid var(--card-border)",
                          borderRadius: 12,
                          backdropFilter: "blur(8px)",
                          fontSize: "0.8rem",
                        }}
                        formatter={(v) => [v.toLocaleString(), "KSE-30"]}
                      />
                      <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#gradKse30)" dot={false} activeDot={{ r: 4, fill: "#10B981" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </div>
          )}

          {mutualFunds.length > 0 && (
            <Card>
              <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Mutual Fund Watchlist</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Fund Name</th>
                      <th>Category</th>
                      <th>NAV</th>
                      <th>1-Year Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mutualFunds.map((f, i) => (
                      <tr key={f.id || i}>
                        <td style={{ fontWeight: 600 }}>{f.name || f.fundName || "\u2014"}</td>
                        <td><Badge>{f.category || "\u2014"}</Badge></td>
                        <td className="tabular">{f.nav ? `PKR ${Number(f.nav).toLocaleString()}` : "\u2014"}</td>
                        <td>
                          {f.oneYearReturn != null ? (
                            <Badge variant={f.oneYearReturn >= 0 ? "gain" : "loss"}>
                              <span>{f.oneYearReturn >= 0 ? "\u2191" : "\u2193"}</span>
                              {f.oneYearReturn >= 0 ? "+" : ""}{(f.oneYearReturn * 100).toFixed(2)}%
                            </Badge>
                          ) : "\u2014"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
