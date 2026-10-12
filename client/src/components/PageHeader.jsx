export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header" style={children ? { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } : undefined}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
