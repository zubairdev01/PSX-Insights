import { useState, useEffect } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

export default function Dividends() {
  const { user } = useAuth();
  const [dividends, setDividends] = useState([]);
  const [projection, setProjection] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ holdingId: "", amount: "", exDate: "", sharesAtExDate: "", reinvested: false, sharesAdded: "" });

  const loadData = async () => {
    try {
      const [dRes, pRes, hRes] = await Promise.all([
        api.get("/dividends"),
        api.get("/dividends/projection"),
        api.get("/portfolio"),
      ]);
      setDividends(dRes.data);
      setProjection(pRes.data);
      setHoldings(hRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/dividends", form);
    setForm({ holdingId: "", amount: "", exDate: "", sharesAtExDate: "", reinvested: false, sharesAdded: "" });
    setShowForm(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this dividend record?")) return;
    await api.delete(`/dividends/${id}`);
    loadData();
  };

  if (loading) {
    return (
      <div>
        <div className="page-header"><h1>Dividends</h1><p>Dividend history & projections</p></div>
        <Skeleton height={300} />
      </div>
    );
  }

  const totalReceived = dividends.reduce((s, d) => s + Number(d.amountReceived || 0), 0);
  const nextEstimate = projection.reduce((s, p) => s + (p.projectedAnnual || 0) / 4, 0);

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Dividends</h1>
          <p>Dividend history & projections</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + Log Dividend
        </Button>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Log Dividend">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="input-wrapper">
              <label className="input-label">Holding</label>
              <select className="input select" value={form.holdingId} onChange={(e) => setForm({ ...form, holdingId: e.target.value })} required>
                <option value="">Select holding</option>
                {holdings.map((h) => (
                  <option key={h.id} value={h.id}>{h.symbol} - {h.quantity} shares</option>
                ))}
              </select>
            </div>
            <Input type="number" step="0.01" label="Amount Received (PKR)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            <Input type="date" label="Ex-Date" value={form.exDate} onChange={(e) => setForm({ ...form, exDate: e.target.value })} required />
            <Input type="number" step="0.01" label="Shares at Ex-Date" value={form.sharesAtExDate} onChange={(e) => setForm({ ...form, sharesAtExDate: e.target.value })} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "var(--text-primary)" }}>
              <input type="checkbox" checked={form.reinvested} onChange={(e) => setForm({ ...form, reinvested: e.target.checked })} style={{ accentColor: "var(--blue)" }} />
              Reinvested (DRIP)
            </label>
            {form.reinvested && (
              <Input type="number" step="0.01" label="Shares Added" value={form.sharesAdded} onChange={(e) => setForm({ ...form, sharesAdded: e.target.value })} />
            )}
            <Button variant="primary" type="submit">Save Dividend</Button>
          </div>
        </form>
      </Modal>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", marginBottom: 24 }}>
        <Card className="stat-card">
          <div className="stat-label">Total Dividends Received</div>
          <div className="stat-value" style={{ fontSize: "1.8rem", marginTop: 4, color: "var(--green)" }}>
            PKR {totalReceived.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 8 }}>
            {dividends.length} payment{dividends.length !== 1 ? "s" : ""}
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-label">Next Quarter Estimate</div>
          <div className="stat-value" style={{ fontSize: "1.8rem", marginTop: 4 }}>
            PKR {Math.round(nextEstimate).toLocaleString()}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 8, maxWidth: 240, marginLeft: "auto", marginRight: "auto" }}>
            Historical-average estimate, not a guarantee
          </div>
        </Card>
      </div>

      {projection.length > 0 && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Projected Annual Income</h3>
          <div className="stats-grid" style={{ marginBottom: 0 }}>
            {projection.map((p) => (
              <Card key={p.symbol} className="stat-card" hover={false}>
                <div className="stat-value" style={{ fontSize: "1.1rem", fontFamily: "'Manrope', system-ui, sans-serif" }}>{p.symbol}</div>
                <div className="stat-label">Yield: {(p.dividendYield * 100).toFixed(2)}%</div>
                <div style={{ fontSize: "0.85rem", marginTop: 8 }}>
                  <div className="tabular">Annual: PKR {Math.round(p.projectedAnnual).toLocaleString()}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }} className="tabular">
                    Monthly: PKR {Math.round(p.projectedMonthly).toLocaleString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {dividends.length === 0 ? (
        <EmptyState
          title="No dividends logged yet"
          description="Log your first dividend payment to start tracking your income."
          actionLabel="Log Your First Dividend"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <Card>
          <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>Dividend History</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Per Share</th>
                  <th>Received</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dividends.map((d) => {
                  const perShare = d.sharesAtExDate > 0 ? Number(d.amountReceived) / d.sharesAtExDate : null;
                  const type = d.dividend?.type || (d.reinvested ? "Bonus" : "Cash");
                  return (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600, fontFamily: "'Manrope', system-ui, sans-serif" }}>{d.dividend?.company?.symbol || d.holding?.symbol}</td>
                      <td className="tabular">{new Date(d.dividend?.exDate || d.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Badge variant={type === "Bonus" ? "accent" : type === "Cash" ? "gain" : "default"}>
                          {type}
                        </Badge>
                      </td>
                      <td className="tabular">{perShare ? `PKR ${perShare.toFixed(2)}` : "\u2014"}</td>
                      <td className="tabular" style={{ fontWeight: 600, color: "var(--green)" }}>
                        PKR {Number(d.amountReceived).toLocaleString()}
                      </td>
                      <td>
                        <button className="btn-icon" title="Delete" onClick={() => handleDelete(d.id)} style={{ color: "var(--red)", width: 32, height: 32, fontSize: "0.85rem" }}>
                          \u2716
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
