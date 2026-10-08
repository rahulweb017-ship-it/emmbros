export function FormField({
  label,
  error,
  required = false,
  hint = null,
  htmlFor,
  children,
  className = "",
}) {
  return (
    <div className={`admin-form-field ${error ? "has-error" : ""} ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="admin-form-label">
          {label}
          {required && <span className="admin-required-star">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="admin-form-hint">{hint}</span>}
      {error && <span className="admin-form-error">{error}</span>}
    </div>
  );
}
