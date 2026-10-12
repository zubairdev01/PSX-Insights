export default function Select({ className = "", label, children, ...props }) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <select className={`input select ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}
