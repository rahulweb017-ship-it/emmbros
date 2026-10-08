import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient } from "../../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/api/auth/me");
      if (data.ok && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    function handleUnauthorized() {
      setUser(null);
      setLoading(false);
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [checkAuth]);

  const login = async (email, password) => {
    const data = await apiClient.post("/api/auth/login", { email, password });
    if (data.ok && data.user) {
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/auth/logout", {});
    } catch (err) {
      // Ignore logout errors
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
