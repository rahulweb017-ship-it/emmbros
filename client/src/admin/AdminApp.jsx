import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/AdminLayout";

import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PostsPage } from "./pages/PostsPage";
import { PostEditPage } from "./pages/PostEditPage";
import { JobsPage } from "./pages/JobsPage";
import { JobEditPage } from "./pages/JobEditPage";
import { JobApplicationsPage } from "./pages/JobApplicationsPage";
import { PagesPage } from "./pages/PagesPage";
import { PageEditPage } from "./pages/PageEditPage";
import { RedirectsPage } from "./pages/RedirectsPage";
import { UsersPage } from "./pages/UsersPage";
import { MediaPage } from "./pages/MediaPage";
import { SettingsPage } from "./pages/SettingsPage";

import "./admin.css";

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Admin Route: Login */}
          <Route path="login" element={<LoginPage />} />

          {/* Protected Admin Shell */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="posts/new" element={<PostEditPage />} />
            <Route path="posts/:id" element={<PostEditPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/new" element={<JobEditPage />} />
            <Route path="jobs/:id" element={<JobEditPage />} />
            <Route path="jobs/:id/applications" element={<JobApplicationsPage />} />
            <Route path="applications" element={<JobApplicationsPage />} />
            <Route path="pages" element={<PagesPage />} />
            <Route path="pages/new" element={<PageEditPage />} />
            <Route path="pages/:id" element={<PageEditPage />} />
            <Route path="redirects" element={<RedirectsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
