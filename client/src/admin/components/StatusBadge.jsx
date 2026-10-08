export function StatusBadge({ status }) {
  const normStatus = String(status || "draft").toLowerCase();

  let variant = "draft";
  let label = status || "Draft";

  switch (normStatus) {
    case "published":
    case "open":
      variant = "success";
      label = normStatus === "open" ? "Open" : "Published";
      break;
    case "draft":
      variant = "warning";
      label = "Draft";
      break;
    case "scheduled":
      variant = "info";
      label = "Scheduled";
      break;
    case "closed":
      variant = "neutral";
      label = "Closed";
      break;
    default:
      variant = "neutral";
      label = status;
  }

  return (
    <span className={`admin-status-badge admin-badge-${variant}`}>
      <span className="admin-badge-dot" />
      {label}
    </span>
  );
}
