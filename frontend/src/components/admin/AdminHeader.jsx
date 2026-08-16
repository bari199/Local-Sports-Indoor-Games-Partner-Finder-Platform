import { useEffect, useRef, useState } from "react";
import {
  Home,
  LayoutDashboard,
  Users,
  Trophy,
  UserRoundCheck,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);

  /* ============================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ============================================================ */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ============================================================
     LOGOUT
  ============================================================ */

  const handleLogout = async () => {
    try {
      setIsMenuOpen(false);

      await logout();

      navigate("/login");
    } catch (error) {
      console.error(
        "Admin logout error:",
        error
      );
    }
  };

  /* ============================================================
     MENU ITEMS
  ============================================================ */

  const menuItems = [
    {
      label: "Home",
      path: "/",
      icon: Home,
    },
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
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-20 items-center
        justify-between
        border-b border-[#0069A6]
        bg-[#0078BD]
        px-4 sm:px-6
        text-white
        shadow-sm
      "
    >
      {/* ======================================================
          LEFT
      ====================================================== */}

      <div>
        <p className="text-xs font-medium text-white/70 sm:text-sm">
          Welcome back
        </p>

        <h2 className="text-base font-semibold text-white sm:text-lg">
          {user?.name || "Admin"}
        </h2>
      </div>

      {/* ======================================================
          RIGHT
      ====================================================== */}

      <div
        ref={menuRef}
        className="relative"
      >
        <div className="flex items-center gap-3">

          {/* Admin Information */}

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">
              SportsConnect Admin
            </p>

            <p className="text-xs text-white/70">
              Administrator
            </p>
          </div>

          {/* ==================================================
              AVATAR = MENU TRIGGER
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setIsMenuOpen((prev) => !prev)
            }
            aria-label="Open admin menu"
            aria-expanded={isMenuOpen}
            className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              overflow-hidden
              rounded-full
              border border-white/20
              bg-white/10
              text-white
              transition
              hover:bg-white/20
              focus:outline-none
              focus:ring-2
              focus:ring-white/40
              active:scale-95
            "
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user?.name || "Admin"}
                className="h-full w-full object-cover"
              />
            ) : (
              <ShieldCheck size={20} />
            )}
          </button>
        </div>

        {/* ======================================================
            DROPDOWN MENU
        ====================================================== */}

        {isMenuOpen && (
          <div
            className="
              absolute
              right-0
              top-14
              z-50
              w-60
              overflow-hidden
              rounded-2xl
              border border-slate-200
              bg-white
              shadow-xl
            "
          >
            {/* Menu Header */}

            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">
                SportsConnect Admin
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {user?.email || "Administrator"}
              </p>
            </div>

            {/* Navigation */}

            <div className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() =>
                      setIsMenuOpen(false)
                    }
                    className={({ isActive }) =>
                      `
                        flex items-center gap-3
                        rounded-xl
                        px-3 py-2.5
                        text-sm font-medium
                        transition

                        ${
                          isActive
                            ? "bg-sky-50 text-[#0078BD]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-[#0078BD]"
                        }
                      `
                    }
                  >
                    <Icon size={18} />

                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Logout */}

            <div className="border-t border-slate-100 p-2">
              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex w-full
                  items-center gap-3
                  rounded-xl
                  px-3 py-2.5
                  text-sm font-medium
                  text-slate-600
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <LogOut size={18} />

                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;