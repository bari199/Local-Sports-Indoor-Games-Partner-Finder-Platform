import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  /* ----------------------------------------------------------
     AUTHENTICATION CHECK
  ---------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0078BD]" />
      </div>
    );
  }

  /* ----------------------------------------------------------
     NOT LOGGED IN
  ---------------------------------------------------------- */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /* ----------------------------------------------------------
     ADMIN CHECK
  ---------------------------------------------------------- */

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  /* ----------------------------------------------------------
     ADMIN VERIFIED
  ---------------------------------------------------------- */

  return <Outlet />;
};

export default AdminRoute;