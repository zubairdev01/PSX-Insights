export default function Skeleton({ width, height = 20, borderRadius, style, className = "" }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || "100%",
        height,
        borderRadius: borderRadius || "var(--radius-sm)",
        ...style,
      }}
    />
  );
}

export function StatsSkeleton({ count = 4 }) {
  return (
    <div className="stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <Skeleton height={60} />
        </div>
      ))}
    </div>
  );
}
