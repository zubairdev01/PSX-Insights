import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Skeleton from "../components/Skeleton";

export default function Analysis() {
  const { symbol } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [projection, setProjection] = useState(null);
  const [risk, setRisk] = useState(null);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    api.get(`/companies/${symbol}`).then((res) => {
      setCompany(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [symbol]);

  const generate = async (type) => {
    setGenerating(type);
    try {
      const endpoint = type === "summary" ? "summary"
        : type === "projection" ? "projection" : "risk";
      const res = await api.post(`/analysis/${endpoint}/${symbol}`);
      if (type === "summary") setSummary(res.data);
      else if (type === "projection") setProjection(res.data);
      else setRisk(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to generate. Check API key.");
    } finally {
      setGenerating(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header"><h1>AI Analysis: {symbol}</h1></div>
        <Skeleton height={500} />
      </div>
    );
  }

  if (!company) {
    return <Card style={{ textAlign: "center", padding: 48 }}><p>Company data not available</p></Card>;
  }

  const Spinner = () => <div className="spinner" style={{ width: 20, height: 20 }} />;

  return (
    <div>
      <div className="page-header">
        <h1>AI Analysis: {symbol}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
          Powered by AI &mdash; for informational purposes only
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <Button variant="primary" onClick={() => generate("summary")} disabled={generating !== null}>
          {generating === "summary" ? <><Spinner /> Generating...</> : "Generate Stock Summary"}
        </Button>
        <Button onClick={() => generate("projection")} disabled={generating !== null}>
          {generating === "projection" ? <><Spinner /> Generating...</> : "Future Projection"}
        </Button>
        <Button onClick={() => generate("risk")} disabled={generating !== null}>
          {generating === "risk" ? <><Spinner /> Generating...</> : "Risk Analysis"}
        </Button>
      </div>

      {summary && (
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: "0.95rem" }}>Stock Summary</h3>
            <Badge variant="accent">{summary.symbol}</Badge>
          </div>
          <Section title="Business Model" content={summary.businessModel} />
          {summary.marketSnapshot && (
            <Section title="Market Snapshot">
              <KV label="Market Cap" value={summary.marketSnapshot.marketCap} />
              <KV label="P/E" value={summary.marketSnapshot.pe} />
              <KV label="52-Week Range" value={summary.marketSnapshot.week52Range} />
              <KV label="1-Year Change" value={summary.marketSnapshot.year1Change} />
              <KV label="YTD Change" value={summary.marketSnapshot.ytdChange} />
            </Section>
          )}
          {summary.financials && (
            <Section title="Financials">
              <KV label="Revenue" value={summary.financials.revenue} />
              <KV label="Profit After Tax" value={summary.financials.profitAfterTax} />
              <KV label="EPS" value={summary.financials.eps} />
            </Section>
          )}
          {summary.overview && (
            <Section title="Company Overview">
              <KV label="CEO" value={summary.overview.ceo} />
              <KV label="Sector" value={summary.overview.sector} />
              <KV label="Shares Outstanding" value={summary.overview.sharesOutstanding} />
              <KV label="Free Float" value={summary.overview.freeFloat} />
            </Section>
          )}
          {summary.summary && <Section title="Bottom Line" content={summary.summary} />}
          <Disclaimer text={summary.disclaimer} />
        </Card>
      )}

      {projection && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Future Projection</h3>
          {projection.targetPriceRange && (
            <div className="stats-grid" style={{ marginBottom: 16 }}>
              <Card className="stat-card" hover={false}>
                <div className="stat-label">Target Low</div>
                <div className="stat-value" style={{ color: "var(--green)", fontSize: "1.3rem" }}>
                  PKR {projection.targetPriceRange.low?.toLocaleString()}
                </div>
              </Card>
              <Card className="stat-card" hover={false}>
                <div className="stat-label">Current</div>
                <div className="stat-value" style={{ color: "var(--blue)", fontSize: "1.3rem" }}>
                  PKR {projection.currentPrice?.toLocaleString()}
                </div>
              </Card>
              <Card className="stat-card" hover={false}>
                <div className="stat-label">Target High</div>
                <div className="stat-value" style={{ color: "var(--green)", fontSize: "1.3rem" }}>
                  PKR {projection.targetPriceRange.high?.toLocaleString()}
                </div>
              </Card>
            </div>
          )}
          <Section title="Short-Term Outlook" content={projection.shortTermOutlook} />
          <Section title="Long-Term Outlook" content={projection.longTermOutlook} />
          {projection.keyDrivers?.length > 0 && (
            <Section title="Key Drivers">
              <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                {projection.keyDrivers.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </Section>
          )}
          {projection.levelsToWatch && (
            <Section title="Levels to Watch">
              <KV label="Support" value={projection.levelsToWatch.support?.toLocaleString()} />
              <KV label="Resistance" value={projection.levelsToWatch.resistance?.toLocaleString()} />
            </Section>
          )}
          <Disclaimer text={projection.disclaimer} />
        </Card>
      )}

      {risk && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Risk Analysis</h3>
          <Section title="Overview" content={risk.overview} />
          {risk.specificRisks?.length > 0 && (
            <Section title="Specific Risk Factors">
              {risk.specificRisks.map((r, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  padding: "12px 0", borderBottom: "1px solid var(--card-border)",
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{r.factor}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 2 }}>{r.description}</div>
                  </div>
                  <Badge variant={r.severity === "high" ? "loss" : r.severity === "medium" ? "accent" : "gain"}>
                    {r.severity}
                  </Badge>
                </div>
              ))}
            </Section>
          )}
          {risk.downsideLevels && (
            <Section title="Downside Scenarios">
              <KV label="52-Week Low Impact" value={risk.downsideLevels.fiftyTwoWeekLowImpact} />
              <KV label="Stress Scenario" value={risk.downsideLevels.stressScenario} />
            </Section>
          )}
          <Section title="Market Context" content={risk.marketContext} />
          <Disclaimer text={risk.disclaimer} />
        </Card>
      )}

      {!summary && !projection && !risk && (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
            Click a button above to generate AI-powered insights for {symbol}.
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Requires ANTHROPIC_API_KEY or OPENAI_API_KEY in the server .env file.
          </p>
        </Card>
      )}
    </div>
  );
}

function Section({ title, content, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Manrope', system-ui, sans-serif" }}>
        {title}
      </h4>
      {content && <p style={{ lineHeight: 1.7, fontSize: "0.9rem" }}>{content}</p>}
      {children}
    </div>
  );
}

function KV({ label, value }) {
  if (value == null || value === "N/A" || value === "null") return null;
  return (
    <div style={{ display: "flex", padding: "6px 0", borderBottom: "1px solid var(--card-border)", fontSize: "0.85rem" }}>
      <span style={{ width: 160, color: "var(--text-secondary)", flexShrink: 0 }}>{label}</span>
      <span className="tabular">{value}</span>
    </div>
  );
}

function Disclaimer({ text }) {
  return (
    <div style={{
      marginTop: 16, padding: 12, borderRadius: 12,
      background: "var(--card-bg)", fontSize: "0.78rem",
      color: "var(--text-muted)", fontStyle: "italic",
    }}>
      {text}
    </div>
  );
}
