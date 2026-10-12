export default function Input({ className = "", label, ...props }) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input className={`input ${className}`} {...props} />
    </div>
  );
}
