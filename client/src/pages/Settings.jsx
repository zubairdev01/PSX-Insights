import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Settings() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleThemeToggle = () => {
    toggle();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Account preferences</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 24, maxWidth: 800 }}>
        <Card>
          <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Account</h3>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr><td style={{ color: "var(--text-secondary)", width: 120, padding: "8px 0" }}>Email</td><td style={{ padding: "8px 0" }}>{user?.email}</td></tr>
              <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>Name</td><td style={{ padding: "8px 0" }}>{user?.name || "\u2014"}</td></tr>
              <tr><td style={{ color: "var(--text-secondary)", padding: "8px 0" }}>Joined</td><td style={{ padding: "8px 0" }}>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</td></tr>
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Appearance</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 600 }}>Theme</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                {dark ? "Dark mode \u2014 easier on the eyes for financial dashboards" : "Light mode"}
              </div>
            </div>
            <Button onClick={handleThemeToggle} size="sm">
              {dark ? "\u2600 Light" : "\u263E Dark"}
            </Button>
          </div>
          {saved && (
            <div style={{ marginTop: 12, fontSize: "0.85rem", color: "var(--green)", textAlign: "right" }}>
              Theme updated
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
