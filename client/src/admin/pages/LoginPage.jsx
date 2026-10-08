import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FormField } from "../components/FormField";

export function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/admin";

  if (!authLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const data = await login(email, password);
      if (data.ok) {
        toast.success("Welcome back! Logged in successfully.");
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
      toast.error("Invalid credentials or server error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <h1 className="admin-login-title">Emmbros Admin</h1>
          <p className="admin-login-subtitle">Sign in to manage posts, jobs, and SEO</p>
        </div>

        {error && (
          <div className="admin-toast admin-toast-error" style={{ marginBottom: 16 }}>
            <span className="admin-toast-message">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField label="Email Address" required htmlFor="email">
            <div className="admin-search-box" style={{ maxWidth: "100%" }}>
              <Mail size={16} className="admin-search-icon" />
              <input
                id="email"
                type="email"
                required
                placeholder="admin@emmbrosautocomp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-search-input"
              />
            </div>
          </FormField>

          <FormField label="Password" required htmlFor="password">
            <div className="admin-search-box" style={{ maxWidth: "100%" }}>
              <Lock size={16} className="admin-search-icon" />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-search-input"
              />
            </div>
          </FormField>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign In to Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
