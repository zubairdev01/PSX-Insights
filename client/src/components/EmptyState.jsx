import Button from "./Button";

function EmptyIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.25, marginBottom: 4 }}>
      <rect x="8" y="16" width="48" height="36" rx="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="8" y1="28" x2="56" y2="28" stroke="currentColor" strokeWidth="2" />
      <circle cx="22" cy="36" r="3" fill="currentColor" />
      <circle cx="32" cy="36" r="3" fill="currentColor" />
      <circle cx="42" cy="36" r="3" fill="currentColor" />
      <line x1="22" y1="44" x2="32" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="44" x2="42" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function EmptyState({ title = "No data", description, actionLabel, onAction, icon }) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center", padding: "64px 24px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      }}
    >
      {icon ? <div style={{ fontSize: "2.5rem", opacity: 0.4 }}>{icon}</div> : <EmptyIcon />}
      <h3 style={{ color: "var(--text-secondary)", fontWeight: 600, fontFamily: "'Manrope', system-ui, sans-serif" }}>{title}</h3>
      {description && <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 360 }}>{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} style={{ marginTop: 8 }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
