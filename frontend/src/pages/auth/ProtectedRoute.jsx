import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={28}
            className="animate-spin text-[#0078BD]"
          />

          <p className="text-sm text-slate-500">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;