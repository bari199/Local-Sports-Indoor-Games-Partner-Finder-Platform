import {
  LayoutDashboard,
  Users,
  Trophy,
  UserRoundCheck,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = ({
  isCollapsed,
  setIsCollapsed,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Games",
      path: "/admin/games",
      icon: Trophy,
    },
    {
      label: "Requests",
      path: "/admin/requests",
      icon: UserRoundCheck,
    },
  ];

  // ==============================
  // Logout
  // ==============================
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Admin logout error:", error);
    }
  };

  // ==============================
  // Navigation
  // ==============================
  const handleNavigation = () => {
    // Mobile only: close sidebar after navigation
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  // ==============================
  // Toggle Sidebar
  // ==============================
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      {/* ========================================
          MOBILE OVERLAY
      ======================================== */}
      {!isCollapsed && (
        <div
          className="
            fixed inset-0
            z-30
            bg-black/30
            backdrop-blur-[1px]
            md:hidden
          "
          onClick={() => setIsCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* ========================================
          SIDEBAR
      ======================================== */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-40
          flex
          h-screen
          flex-col
          border-r
          border-slate-200
          bg-white
          shadow-sm
          transition-all
          duration-300
          ease-in-out

          ${
            isCollapsed
              ? "w-20"
              : "w-64"
          }
        `}
      >
        {/* ========================================
            HEADER / LOGO
        ======================================== */}
        <div
          className={`
            flex
            h-20
            shrink-0
            items-center
            border-b
            border-slate-100

            ${
              isCollapsed
                ? "justify-center px-3"
                : "px-5"
            }
          `}
        >
          {/* 
            Logo itself works as
            Expand / Collapse button
          */}
          <button
            type="button"
            onClick={toggleSidebar}
            title={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            aria-label={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className={`
              flex
              items-center
              gap-3
              rounded-xl
              px-2
              py-1
              transition-all
              duration-200
              focus:outline-none

              ${
                isCollapsed
                  ? "justify-center"
                  : "hover:bg-slate-50"
              }
            `}
          >
            {/* Logo Icon */}
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#0078BD]
                text-white
                transition
                duration-200
                hover:scale-105
                active:scale-95
              "
            >
              <ShieldCheck size={22} />
            </div>

            {/* Logo Text */}
            <div
              className={`
                overflow-hidden
                whitespace-nowrap
                text-left
                transition-all
                duration-300

                ${
                  isCollapsed
                    ? "w-0 opacity-0"
                    : "w-auto opacity-100"
                }
              `}
            >
              <h1 className="text-lg font-bold text-slate-900">
                SportsConnect
              </h1>

              <p className="text-xs text-slate-500">
                Admin Panel
              </p>
            </div>
          </button>
        </div>

        {/* ========================================
            NAVIGATION
        ======================================== */}
        <nav
          className="
            flex-1
            space-y-1
            overflow-y-auto
            px-3
            py-6
          "
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                title={
                  isCollapsed
                    ? item.label
                    : undefined
                }
                className={({ isActive }) =>
                  `
                    flex
                    items-center
                    rounded-xl
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isCollapsed
                        ? "justify-center px-3"
                        : "gap-3 px-4"
                    }

                    ${
                      isActive
                        ? "bg-[#0078BD] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#0078BD]"
                    }
                  `
                }
              >
                {/* Menu Icon */}
                <Icon
                  size={19}
                  className="shrink-0"
                />

                {/* Menu Label */}
                <span
                  className={`
                    overflow-hidden
                    whitespace-nowrap
                    transition-all
                    duration-300

                    ${
                      isCollapsed
                        ? "hidden w-0 opacity-0"
                        : "block w-auto opacity-100"
                    }
                  `}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* ========================================
            LOGOUT
        ======================================== */}
        <div
          className="
            shrink-0
            border-t
            border-slate-100
            p-3
          "
        >
          <button
            type="button"
            onClick={handleLogout}
            title={
              isCollapsed
                ? "Logout"
                : undefined
            }
            className={`
              flex
              w-full
              items-center
              rounded-xl
              py-3
              text-sm
              font-medium
              text-slate-600
              transition

              ${
                isCollapsed
                  ? "justify-center px-3"
                  : "gap-3 px-4"
              }

              hover:bg-red-50
              hover:text-red-600
            `}
          >
            {/* Logout Icon */}
            <LogOut
              size={19}
              className="shrink-0"
            />

            {/* Logout Text */}
            <span
              className={`
                overflow-hidden
                whitespace-nowrap
                transition-all
                duration-300

                ${
                  isCollapsed
                    ? "hidden w-0 opacity-0"
                    : "block w-auto opacity-100"
                }
              `}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;