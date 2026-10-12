import { useState, useEffect } from "react";
import api from "../api/client";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

const emptyForm = { symbol: "", quantity: "", avgCost: "", purchaseDate: "", notes: "" };

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadHoldings = () => {
    api.get("/portfolio").then((res) => {
      setHoldings(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadHoldings(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditTarget(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editTarget) {
      await api.put(`/portfolio/${editTarget.id}`, form);
    } else {
      await api.post("/portfolio", form);
    }
    resetForm();
    loadHoldings();
  };

  const handleEdit = (h) => {
    setEditTarget(h);
    setForm({
      symbol: h.symbol,
      quantity: String(h.quantity),
      avgCost: String(h.avgCost),
      purchaseDate: h.purchaseDate?.split("T")[0] || "",
      notes: h.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this holding?")) return;
    await api.delete(`/portfolio/${id}`);
    loadHoldings();
  };

  if (loading) {
    return (
      <div>
        <div className="page-header"><h1>Portfolio</h1><p>Manage your holdings</p></div>
        <Skeleton height={300} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Portfolio</h1>
          <p>Manage your holdings</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Add Holding
        </Button>
      </div>

      <Modal open={showForm} onClose={resetForm} title={editTarget ? "Edit Holding" : "New Holding"}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!editTarget && (
              <Input label="Symbol" placeholder="e.g. MARI" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} required />
            )}
            {editTarget && (
              <div className="input-wrapper">
                <label className="input-label">Symbol</label>
                <div style={{ padding: "12px 16px", background: "var(--input-bg)", borderRadius: 12, fontWeight: 600, border: "1px solid var(--input-border)" }}>
                  {editTarget.symbol}
                </div>
              </div>
            )}
            <Input label="Quantity" type="number" step="0.01" placeholder="Number of shares" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            <Input label="Avg Cost (PKR)" type="number" step="0.01" placeholder="Price per share" value={form.avgCost} onChange={(e) => setForm({ ...form, avgCost: e.target.value })} required />
            <Input label="Purchase Date" type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} required />
            <Input label="Notes (optional)" placeholder="Any notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <Button variant="primary" type="submit" style={{ marginTop: 4 }}>
              {editTarget ? "Save Changes" : "Add Holding"}
            </Button>
          </div>
        </form>
      </Modal>

      {holdings.length === 0 ? (
        <EmptyState
          title="No holdings yet"
          description="Add your first holding to start tracking your PSX portfolio."
          actionLabel="Add Your First Holding"
          onAction={() => { resetForm(); setShowForm(true); }}
        />
      ) : (
        <Card>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Qty</th>
                  <th>Avg Cost</th>
                  <th>Current</th>
                  <th>Market Value</th>
                  <th>Unrealized P&L</th>
                  <th>Day</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const pnl = h.unrealizedPnl || 0;
                  const day = h.dayChangePercent || 0;
                  return (
                    <tr key={h.id}>
                      <td style={{ fontWeight: 600, fontFamily: "'Manrope', system-ui, sans-serif" }}>{h.symbol}</td>
                      <td className="tabular">{h.quantity}</td>
                      <td className="tabular">PKR {Number(h.avgCost).toLocaleString()}</td>
                      <td className="tabular">PKR {Number(h.currentPrice).toLocaleString()}</td>
                      <td className="tabular">PKR {Number(h.marketValue).toLocaleString()}</td>
                      <td>
                        <span className={`change-pill ${pnl >= 0 ? "gain" : "loss"}`}>
                          <span>{pnl >= 0 ? "\u2191" : "\u2193"}</span>
                          {pnl >= 0 ? "+" : ""}PKR {Math.abs(pnl).toLocaleString()}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: 6, fontVariantNumeric: "tabular-nums" }}>
                          ({h.unrealizedPnlPercent >= 0 ? "+" : ""}{h.unrealizedPnlPercent?.toFixed(2)}%)
                        </span>
                      </td>
                      <td>
                        <Badge variant={day >= 0 ? "gain" : "loss"}>
                          <span>{day >= 0 ? "\u2191" : "\u2193"}</span>
                          {day >= 0 ? "+" : ""}{day}%
                        </Badge>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn-icon" title="Edit" onClick={() => handleEdit(h)}>
                            \u270E
                          </button>
                          <button className="btn-icon" title="Delete" onClick={() => handleDelete(h.id)} style={{ color: "var(--red)" }}>
                            \u2716
                          </button>
                        </div>
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
