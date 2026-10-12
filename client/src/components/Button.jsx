export default function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  style,
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
