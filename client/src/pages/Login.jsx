import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email and password are required"); return; }
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, position: "relative" }}>
      <div style={{ position: "absolute", top: 24, right: 24 }}><ThemeToggle /></div>
      <Card style={{ maxWidth: 400, width: "100%" }}>
        <h2 style={{ marginBottom: 4, fontFamily: "'Manrope', system-ui, sans-serif" }}>Welcome back</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "0.9rem" }}>Sign in to your PSX Insight account</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && (
            <div style={{
              color: "var(--red)", marginBottom: 12, fontSize: "0.85rem",
              padding: "8px 14px", background: "rgba(239,68,68,0.1)",
              borderRadius: 10, border: "1px solid rgba(239,68,68,0.2)",
            }}>
              {error}
            </div>
          )}
          <Button variant="primary" style={{ width: "100%" }} disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div style={{ marginTop: 20, textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          No account? <Link to="/signup">Sign up</Link>
        </div>
      </Card>
    </div>
  );
}
