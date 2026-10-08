export function LoadingSpinner({ message = "Loading...", size = "medium" }) {
  return (
    <div className={`admin-spinner-wrapper admin-spinner-${size}`}>
      <div className="admin-spinner-ring" />
      {message && <p className="admin-spinner-text">{message}</p>}
    </div>
  );
}
