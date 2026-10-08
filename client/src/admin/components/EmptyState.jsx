import { FolderOpen } from "lucide-react";

export function EmptyState({
  icon: Icon = FolderOpen,
  title = "No items found",
  description = "There are no records matching your request.",
  actionButton = null,
}) {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-icon">
        <Icon size={40} />
      </div>
      <h3 className="admin-empty-title">{title}</h3>
      {description && <p className="admin-empty-desc">{description}</p>}
      {actionButton && <div className="admin-empty-action">{actionButton}</div>}
    </div>
  );
}
