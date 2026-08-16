import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div
        className={`
          min-h-screen
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        {/* Header */}
        <AdminHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;