import { useEffect, useState } from "react";
import {
  Menu,
  Trophy,
  UserRound,
  Users,
  Gamepad2,
  LogOut,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useAuth from "../../hooks/useAuth";
import { logoutUser } from "../../services/authService";
import {
  getReceivedRequests,
} from "../../services/partnerRequestService";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // ============================================================
  // REQUEST COUNT
  // ============================================================

  const [requestCount, setRequestCount] = useState(0);

  // ============================================================
  // FETCH PENDING REQUEST COUNT
  // ============================================================

  const fetchRequestCount = async () => {
    try {
      if (!user) {
        setRequestCount(0);
        return;
      }

      const response =
        await getReceivedRequests();

      if (response?.success) {
        setRequestCount(
          response.count || 0
        );
      }
    } catch (error) {
      console.error(
        "Request count error:",
        error
      );
    }
  };

  // ============================================================
  // INITIAL REQUEST COUNT
  // ============================================================

  useEffect(() => {
    if (!user) {
      setRequestCount(0);
      return;
    }

    fetchRequestCount();

    // ========================================================
    // AUTO REFRESH EVERY 30 SECONDS
    // ========================================================

    const interval = setInterval(() => {
      fetchRequestCount();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logoutUser();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      localStorage.removeItem(
        "accessToken"
      );

      setUser(null);

      setRequestCount(0);

      toast.success(
        "Logged out successfully"
      );

      navigate("/login", {
        replace: true,
      });

      setLoggingOut(false);
    }
  };

  // ============================================================
  // NAVIGATION ITEMS
  // ============================================================

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Trophy,
    },
    {
      name: "Players",
      path: "/players",
      icon: Users,
    },
    {
      name: "Games",
      path: "/games",
      icon: Gamepad2,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserRound,
    },
    {
      name: "Requests",
      path: "/requests",
      icon: Users,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">

      {/* ======================================================
          MAIN NAVBAR
      ====================================================== */}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ====================================================
            LOGO
        ==================================================== */}

        <Link
          to="/dashboard"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0078BD] text-white">
            <Trophy size={19} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-bold tracking-tight text-slate-900">
              SportsConnect
            </p>

            <p className="text-[10px] text-slate-400">
              Find. Connect. Play.
            </p>
          </div>
        </Link>

        {/* ====================================================
            DESKTOP NAVIGATION
        ==================================================== */}

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  relative
                  flex items-center gap-2
                  rounded-lg
                  px-3.5 py-2
                  text-sm font-medium
                  transition
                  ${
                    isActive
                      ? "bg-[#0078BD]/10 text-[#0078BD]"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }
                  `
                }
              >
                <Icon size={16} />

                {item.name}

                {/* ==================================================
                    REQUEST BADGE
                ================================================== */}

                {item.name === "Requests" &&
                  requestCount > 0 && (
                    <span
                      className="
                        absolute
                        -right-1
                        -top-1
                        flex
                        min-h-[18px]
                        min-w-[18px]
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500
                        px-1
                        text-[10px]
                        font-bold
                        leading-none
                        text-white
                        ring-2
                        ring-white
                      "
                    >
                      {requestCount > 99
                        ? "99+"
                        : requestCount}
                    </span>
                  )}
              </NavLink>
            );
          })}
        </nav>

        {/* ====================================================
            DESKTOP USER
        ==================================================== */}

        <div className="hidden items-center gap-3 md:flex">

          <div className="text-right">
            <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-400">
              {user?.skillLevel || "Player"}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#0078BD]/10 text-[#0078BD]">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={17} />
            )}
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Logout"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-red-50
              hover:text-red-500
              disabled:opacity-50
            "
          >
            <LogOut size={17} />
          </button>
        </div>

        {/* ====================================================
            MOBILE MENU BUTTON
        ==================================================== */}

        <button
          onClick={() =>
            setMobileOpen(
              (prev) => !prev
            )
          }
          className="
            relative
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            text-slate-600
            hover:bg-slate-100
            md:hidden
          "
        >
          {mobileOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}

          {/* ==================================================
              MOBILE REQUEST BADGE
          ================================================== */}

          {!mobileOpen &&
            requestCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  min-h-[18px]
                  min-w-[18px]
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[10px]
                  font-bold
                  text-white
                  ring-2
                  ring-white
                "
              >
                {requestCount > 99
                  ? "99+"
                  : requestCount}
              </span>
            )}
        </button>
      </div>

      {/* ======================================================
          MOBILE NAVIGATION
      ====================================================== */}

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className={({ isActive }) =>
                    `
                    flex items-center
                    justify-between
                    rounded-lg
                    px-3 py-2.5
                    text-sm font-medium
                    ${
                      isActive
                        ? "bg-[#0078BD]/10 text-[#0078BD]"
                        : "text-slate-600 hover:bg-slate-100"
                    }
                    `
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} />

                    {item.name}
                  </div>

                  {/* ==================================================
                      MOBILE REQUEST COUNT
                  ================================================== */}

                  {item.name === "Requests" &&
                    requestCount > 0 && (
                      <span
                        className="
                          flex
                          min-h-[20px]
                          min-w-[20px]
                          items-center
                          justify-center
                          rounded-full
                          bg-red-500
                          px-1.5
                          text-[10px]
                          font-bold
                          text-white
                        "
                      >
                        {requestCount > 99
                          ? "99+"
                          : requestCount}
                      </span>
                    )}
                </NavLink>
              );
            })}
          </nav>

          {/* ====================================================
              MOBILE USER
          ==================================================== */}

          <div className="my-3 border-t border-slate-100" />

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-400">
                {user?.location ||
                  "Local player"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                flex items-center
                gap-2
                rounded-lg
                px-3 py-2
                text-sm font-medium
                text-red-500
                hover:bg-red-50
              "
            >
              <LogOut size={16} />

              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;