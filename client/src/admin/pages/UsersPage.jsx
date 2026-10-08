import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Shield, User as UserIcon } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { DataTable } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load user accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("editor");
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setEditingId(u._id);
    setName(u.name || "");
    setEmail(u.email || "");
    setPassword(""); // Leave blank if unedited
    setRole(u.role || "editor");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    if (!editingId && !password) {
      toast.error("Password is required for new user accounts.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await apiClient.put(`/api/admin/users/${editingId}`, {
          name,
          email,
          role,
          ...(password && { password }),
        });
        toast.success("User account updated!");
      } else {
        await apiClient.post("/api/admin/users", {
          name,
          email,
          password,
          role,
        });
        toast.success("New user account created!");
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to save user account.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await apiClient.delete(`/api/admin/users/${deletingId}`);
      toast.success("User account deleted.");
      setDeletingId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to delete user account.");
    }
  };

  const columns = [
    {
      header: "User Profile",
      accessorKey: "name",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="admin-avatar" style={{ width: 34, height: 34 }}>
            <UserIcon size={16} />
          </div>
          <div>
            <strong style={{ fontSize: 14 }}>{row.name}</strong>
            <div className="admin-form-hint">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role Permission",
      accessorKey: "role",
      cell: (row) => (
        <span
          style={{
            padding: "3px 10px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            textTransform: "capitalize",
            background: row.role === "admin" ? "#fcf0f1" : "#e5f5fa",
            color: row.role === "admin" ? "#d63638" : "#0073aa",
            border: `1px solid ${row.role === "admin" ? "#e68a8c" : "#0073aa"}`,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Shield size={12} /> {row.role}
        </span>
      ),
    },
    {
      header: "Created Date",
      accessorKey: "createdAt",
      cell: (row) =>
        new Date(row.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  return (
    <div className="admin-users-view">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">User Accounts & Roles</h1>
          <p className="admin-page-subtitle">Manage administrative staff accounts, passwords, and permission roles</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          <span>Add New User</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        total={users.length}
        emptyMessage="No users found."
        renderRowActions={(row) => (
          <div style={{ textAlign: "right", display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button type="button" className="admin-btn-icon" title="Edit User" onClick={() => openEditModal(row)}>
              <Edit size={14} />
            </button>
            {row._id !== currentUser?._id && (
              <button type="button" className="admin-btn-icon" title="Delete User" onClick={() => setDeletingId(row._id)}>
                <Trash2 size={14} color="#d63638" />
              </button>
            )}
          </div>
        )}
      />

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal-card" style={{ maxWidth: 460, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
              {editingId ? "Edit User Account" : "Create User Account"}
            </h3>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Amit Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Email Address</label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="amit@emmbros.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Password {editingId && "(Leave blank to keep current password)"}
                </label>
                <input
                  type="password"
                  className="admin-input"
                  placeholder={editingId ? "••••••••" : "Min 6 characters"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={editingId ? 0 : 6}
                  required={!editingId}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Role Permission</label>
                <select className="admin-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="editor">Editor (Manages Posts, Jobs, Pages & Media)</option>
                  <option value="admin">Administrator (Full Access including Settings & Users)</option>
                </select>
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save User Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          title="Delete User Account"
          message="Are you sure you want to remove this staff user account? This user will no longer be able to log in."
          confirmLabel="Delete User"
          isDanger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
