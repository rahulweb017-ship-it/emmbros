import { AlertTriangle, X } from "lucide-react";

export function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className={`admin-modal-icon admin-modal-icon-${variant}`}>
            <AlertTriangle size={20} />
          </div>
          <h3 className="admin-modal-title">{title}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="admin-modal-body">
          <p>{message}</p>
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-${variant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
