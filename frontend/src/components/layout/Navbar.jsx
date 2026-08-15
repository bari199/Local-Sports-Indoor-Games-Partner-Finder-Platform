import { useEffect, useState } from "react";
import {
  Menu,
  Trophy,
  UserRound,
  Users,
  Gamepad2,
  LogOut,
  X,
  MoreHorizontal,
  Settings,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useAuth from "../../hooks/useAuth";
import { logoutUser } from "../../services/authService";
import { getReceivedRequests } from "../../services/partnerRequestService";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

      const response = await getReceivedRequests();

      if (response?.success) {
        setRequestCount(response.count || 0);
      }
    } catch (error) {
      console.error("Request count error:", error);
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
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");

      setUser(null);

      setRequestCount(0);

      setMenuOpen(false);
      setMobileOpen(false);

      toast.success("Logged out successfully");

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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

      {/* ======================================================
          MAIN NAVBAR
      ====================================================== */}

      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ====================================================
            LOGO
        ==================================================== */}

        <Link
          to="/dashboard"
          className="group flex items-center gap-2.5"
        >
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-gradient-to-br
              from-[#0078BD]
              to-[#003F88]
              text-white
              shadow-sm
              shadow-[#0078BD]/20
              transition-transform
              duration-200
              group-hover:scale-105
            "
          >
            <Trophy size={19} />
          </div>

          <div className="hidden sm:block">
            <p className="text-[15px] font-black tracking-tight text-slate-900">
              SportsConnect
            </p>

            <p className="text-[10px] font-medium tracking-wide text-slate-400">
              Find. Connect. Play.
            </p>
          </div>
        </Link>

        {/* ====================================================
            DESKTOP NAVIGATION
        ==================================================== */}

        <nav
          className="
            hidden
            items-center
            gap-1
            rounded-2xl
            border border-slate-200/70
            bg-slate-50/80
            p-1
            md:flex
          "
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  relative
                  flex items-center
                  gap-2
                  rounded-xl
                  px-3.5
                  py-2
                  text-[13px]
                  font-semibold
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        bg-white
                        text-[#0078BD]
                        shadow-sm
                        ring-1
                        ring-slate-200/70
                      `
                      : `
                        text-slate-500
                        hover:bg-white/80
                        hover:text-slate-900
                      `
                  }
                  `
                }
              >
                <Icon size={15} />

                {item.name}

                {/* REQUEST BADGE */}

                {item.name === "Requests" &&
                  requestCount > 0 && (
                    <span
                      className="
                        absolute
                        -right-1.5
                        -top-1.5
                        flex
                        min-h-[18px]
                        min-w-[18px]
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500
                        px-1
                        text-[9px]
                        font-black
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
            DESKTOP RIGHT SIDE
        ==================================================== */}

        <div className="hidden items-center gap-2.5 md:flex">

          {/* User */}

          <div className="flex items-center gap-2.5">

            {/* User Information */}

            <div className="hidden text-right lg:block">
              <p className="max-w-32 truncate text-sm font-bold text-slate-800">
                {user?.name || "User"}
              </p>

              <p className="text-[11px] font-medium text-slate-400">
                {user?.skillLevel || "Player"}
              </p>
            </div>

            {/* Avatar */}

            <div
              className="
                flex h-10 w-10
                items-center justify-center
                overflow-hidden
                rounded-xl
                bg-[#0078BD]/10
                text-[#0078BD]
                ring-1
                ring-[#0078BD]/10
              "
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user?.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={18} />
              )}
            </div>
          </div>

          {/* ==================================================
              MENU BUTTON
          ================================================== */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setMenuOpen((prev) => !prev)
              }
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                border border-slate-200
                bg-white
                text-slate-500
                transition-all
                duration-200
                hover:border-[#0078BD]/30
                hover:bg-[#0078BD]/5
                hover:text-[#0078BD]
              "
            >
              {menuOpen ? (
                <X size={18} />
              ) : (
                <MoreHorizontal size={19} />
              )}
            </button>

            {/* ==================================================
                DESKTOP MENU DROPDOWN
            ================================================== */}

            {menuOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  w-60
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-1.5
                  shadow-[0_20px_60px_rgba(15,23,42,0.14)]
                "
              >

                {/* User Header */}

                <div
                  className="
                    mb-1
                    rounded-xl
                    bg-slate-50
                    px-3
                    py-3
                  "
                >
                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex h-10 w-10
                        shrink-0
                        items-center justify-center
                        overflow-hidden
                        rounded-xl
                        bg-[#0078BD]/10
                        text-[#0078BD]
                      "
                    >
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user?.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound size={17} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user?.name || "User"}
                      </p>

                      <p className="truncate text-[11px] text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dashboard */}

                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="
                    group
                    flex items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-[#0078BD]/10
                    hover:text-[#0078BD]
                  "
                >
                  <span className="flex items-center gap-3">
                    <LayoutDashboard
                      size={17}
                    />

                    Dashboard
                  </span>

                  <ChevronRight
                    size={15}
                    className="
                      text-slate-300
                      transition-transform
                      group-hover:translate-x-0.5
                    "
                  />
                </Link>

                {/* Profile */}

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="
                    group
                    flex items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  <span className="flex items-center gap-3">
                    <UserRound size={17} />

                    Profile
                  </span>

                  <ChevronRight
                    size={15}
                    className="
                      text-slate-300
                      transition-transform
                      group-hover:translate-x-0.5
                    "
                  />
                </Link>

                {/* Requests */}

                <Link
                  to="/requests"
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center
                    justify-between
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  <span className="flex items-center gap-3">
                    <Users size={17} />

                    Requests
                  </span>

                  {requestCount > 0 && (
                    <span
                      className="
                        flex h-5
                        min-w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500
                        px-1
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
                </Link>

                {/* Settings */}

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="
                    flex w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  <Settings size={17} />

                  Settings
                </button>

                {/* Divider */}

                <div className="my-1.5 border-t border-slate-100" />

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="
                    flex w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    font-semibold
                    text-red-500
                    transition
                    hover:bg-red-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <LogOut size={17} />

                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ====================================================
            MOBILE MENU BUTTON
        ==================================================== */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen((prev) => !prev)
          }
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          className="
            relative
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            border border-slate-200
            bg-white
            text-slate-600
            transition
            hover:border-[#0078BD]/30
            hover:bg-[#0078BD]/5
            hover:text-[#0078BD]
            md:hidden
          "
        >
          {mobileOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}

          {/* Mobile Request Badge */}

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
                  text-[9px]
                  font-black
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
        <div
          className="
            border-t
            border-slate-100
            bg-white
            md:hidden
          "
        >
          <div className="px-4 py-4">

            {/* Mobile User */}

            <div
              className="
                mb-3
                flex
                items-center
                justify-between
                rounded-2xl
                bg-slate-50
                p-3
              "
            >
              <div className="flex items-center gap-3">

                <div
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    overflow-hidden
                    rounded-xl
                    bg-[#0078BD]/10
                    text-[#0078BD]
                  "
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user?.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={18} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {user?.name || "User"}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {user?.skillLevel || "Player"}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}

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
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      font-semibold
                      transition

                      ${
                        isActive
                          ? "bg-[#0078BD]/10 text-[#0078BD]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                      `
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />

                      {item.name}
                    </div>

                    {/* Request Count */}

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
                            font-black
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

            {/* Mobile Secondary Menu */}

            <div className="my-3 border-t border-slate-100" />

            <div className="space-y-1">

              <Link
                to="/settings"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  flex items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  font-semibold
                  text-slate-600
                  hover:bg-slate-50
                "
              >
                <Settings size={18} />

                Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="
                  flex w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-left
                  text-sm
                  font-semibold
                  text-red-500
                  transition
                  hover:bg-red-50
                  disabled:opacity-50
                "
              >
                <LogOut size={18} />

                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;