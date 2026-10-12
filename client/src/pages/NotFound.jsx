import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <Card style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", fontWeight: 800, color: "var(--blue)", marginBottom: 8, fontFamily: "'Manrope', system-ui, sans-serif" }}>404</div>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Page not found</p>
        <Link to="/"><Button variant="primary">Go Home</Button></Link>
      </Card>
    </div>
  );
}
