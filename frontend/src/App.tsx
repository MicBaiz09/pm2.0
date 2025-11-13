import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProcessDetailPage from "@/pages/ProcessDetailPage";
import ServerSettingsPage from "@/pages/ServerSettingsPage";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => {
  const { hydrate } = useAuth();
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/servers"
        element={
          <ProtectedRoute>
            <ServerSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/servers/:serverId/processes/:processId"
        element={
          <ProtectedRoute>
            <ProcessDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
