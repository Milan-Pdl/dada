import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import FounderDashboard from "@/pages/dashboard/FounderDashboard";
import TalentDashboard from "@/pages/dashboard/TalentDashboard";
import InvestorDashboard from "@/pages/dashboard/InvestorDashboard";
import Layout from "@/components/Layout";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function DashboardRouter() {
  const { user } = useAuth();
  if (user?.role === "founder") return <FounderDashboard />;
  if (user?.role === "talent") return <TalentDashboard />;
  if (user?.role === "investor") return <InvestorDashboard />;
  return <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardRouter />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
