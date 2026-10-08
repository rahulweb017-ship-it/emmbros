import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";

export function DataTable({
  columns = [],
  data = [],
  loading = false,
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  searchValue = "",
  onSearchChange,
  statusFilter = "",
  onStatusFilterChange,
  statusOptions = [],
  emptyMessage = "No records found.",
  renderRowActions,
}) {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="admin-datatable-wrapper">
      {/* Controls Bar: Search & Status Filter */}
      {(onSearchChange || onStatusFilterChange) && (
        <div className="admin-datatable-toolbar">
          {onSearchChange && (
            <div className="admin-search-box">
              <Search size={16} className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="admin-search-input"
              />
            </div>
          )}

          {onStatusFilterChange && statusOptions.length > 0 && (
            <div className="admin-filter-box">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="admin-select-input"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-table-loading">
            <LoadingSpinner message="Loading records..." />
          </div>
        ) : data.length === 0 ? (
          <EmptyState description={emptyMessage} />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key || col.accessorKey} style={col.width ? { width: col.width } : {}}>
                    {col.header}
                  </th>
                ))}
                {renderRowActions && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row._id || row.id || idx}>
                  {columns.map((col) => {
                    const value = col.accessorKey ? row[col.accessorKey] : undefined;
                    return (
                      <td key={col.key || col.accessorKey}>
                        {col.cell ? col.cell(row) : value}
                      </td>
                    );
                  })}
                  {renderRowActions && (
                    <td className="admin-row-actions text-right">
                      {renderRowActions(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="admin-datatable-footer">
          <div className="admin-pagination-info">
            Showing <strong>{(page - 1) * limit + 1}</strong> to{" "}
            <strong>{Math.min(page * limit, total)}</strong> of <strong>{total}</strong> entries
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination-controls">
              <button
                type="button"
                className="admin-btn-icon"
                disabled={page <= 1}
                onClick={() => onPageChange && onPageChange(page - 1)}
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="admin-pagination-page">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="admin-btn-icon"
                disabled={page >= totalPages}
                onClick={() => onPageChange && onPageChange(page + 1)}
                aria-label="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
