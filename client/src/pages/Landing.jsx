import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";

const features = [
  { label: "Portfolio Tracking", desc: "Track holdings, P&L, and dividend income in real time" },
  { label: "Company Profiles", desc: "Deep-dive into any PSX stock with fundamentals and charts" },
  { label: "AI Insights", desc: "LLM-powered stock summaries and risk analysis" },
  { label: "Index Tracking", desc: "KSE-100, KSE-30 performance with interactive charts" },
];

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: 32, position: "relative" }}>
      <div style={{ position: "absolute", top: 24, right: 24 }}><ThemeToggle /></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Card style={{ maxWidth: 600, width: "100%" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 12, letterSpacing: "-0.02em" }}>
            PSX Insight
          </h1>
          <p style={{ fontSize: "0.8rem", color: "var(--blue)", fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Pakistan Stock Exchange Research Platform
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: 32, lineHeight: 1.7 }}>
            Track, analyze, and gain AI-powered insights on PSX-listed companies.
            Your personal research layer for smarter investing decisions.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <Link to="/signup"><Button variant="primary">Get Started Free</Button></Link>
            <Link to="/login"><Button>Sign In</Button></Link>
          </div>
        </Card>
        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, maxWidth: 800, width: "100%" }}>
          {features.map((f) => (
            <Card key={f.label} hover={true} style={{ padding: "20px 16px", textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontFamily: "'Manrope', system-ui, sans-serif", marginBottom: 6, fontSize: "0.95rem" }}>{f.label}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{f.desc}</div>
            </Card>
          ))}
        </div>
      </div>
      <footer style={{ textAlign: "center", padding: "24px 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>
        PSX Insight &mdash; For informational purposes only. Not financial advice.
      </footer>
    </div>
  );
}
