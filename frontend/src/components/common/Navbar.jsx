import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  PlayCircle,
  CalendarDays,
  Dumbbell,
  LayoutDashboard,
  UserRound,
  LogOut,
  ChevronDown,
  Settings,
  MapPin,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  const isAuthenticated = Boolean(user);

  const navItems = [
    {
      label: "Play",
      icon: PlayCircle,
      path: "/players",
    },
    {
      label: "Games",
      icon: CalendarDays,
      path: "/games",
    },
    {
      label: "Train",
      icon: Dumbbell,
      path: "/players",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "P";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}

        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0078BD] to-[#003F88] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Dumbbell size={19} />
          </div>

          <div>
            <span className="text-xl font-black tracking-tight text-[#00103E]">
              Local
            </span>

            <span className="text-xl font-black tracking-tight text-[#0078BD]">
              Sports
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-1 rounded-xl bg-slate-50 p-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`
                  flex items-center gap-2 rounded-lg
                  px-4 py-2
                  text-sm font-semibold
                  transition
                  ${
                    active
                      ? "bg-white text-[#0078BD] shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-[#0078BD]"
                  }
                `}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}

        <div className="flex items-center gap-2">

          {isAuthenticated ? (
            <div
              ref={profileRef}
              className="relative"
            >
              {/* Avatar Button */}

              <button
                type="button"
                onClick={() =>
                  setProfileOpen((value) => !value)
                }
                className="
                  group flex items-center gap-2.5
                  rounded-xl border border-transparent
                  p-1.5
                  transition
                  hover:border-slate-200
                  hover:bg-slate-50
                "
              >
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#0078BD] to-[#003F88] text-sm font-bold text-white">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user?.name || "Profile"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      userInitial
                    )}
                  </div>

                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                </div>

                <div className="hidden text-left lg:block">
                  <p className="max-w-[120px] truncate text-sm font-bold text-slate-800">
                    {user?.name || "Player"}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {user?.skillLevel || "Beginner"}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className={`
                    hidden text-slate-400 transition-transform lg:block
                    ${profileOpen ? "rotate-180" : ""}
                  `}
                />
              </button>

              {/* Profile Dropdown */}

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.15)]">

                  <div className="border-b border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#0078BD] to-[#003F88] text-base font-bold text-white">
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt={user?.name || "Profile"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          userInitial
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {user?.name || "Player"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {user?.location && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin size={13} />
                        {user.location}
                      </div>
                    )}
                  </div>

                  <div className="p-2">

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[#0078BD]/10 hover:text-[#0078BD]"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <UserRound size={17} />
                      Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Settings size={17} />
                      Settings
                    </Link>

                    <div className="my-2 border-t border-slate-100" />

                    {/* IMPORTANT:
                        Keep your existing working logout logic here.
                        Don't create a new logout system.
                    */}

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);

                        // Connect this to your existing
                        // Dashboard logout function.
                        navigate("/login");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Sign out
                    </button>

                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest */

            <div className="hidden items-center gap-2 md:flex">

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#003F88] hover:bg-[#0078BD]/10"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="rounded-xl bg-[#0078BD] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#003F88]"
              >
                Join Now
              </button>

            </div>
          )}

          {/* Mobile Button */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen((value) => !value)
            }
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {mobileOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>
      </div>

      {/* Mobile */}

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="space-y-1 px-4 py-4">

            {isAuthenticated && (
              <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#0078BD] to-[#003F88] text-sm font-bold text-white">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user?.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {user?.name || "Player"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {user?.skillLevel || "Beginner"}
                  </p>
                </div>
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-[#0078BD]/10 hover:text-[#0078BD]"
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}

            {isAuthenticated ? (
              <>
                <div className="my-2 border-t border-slate-100" />

                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <UserRound size={18} />
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/login");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </>
            ) : (
              <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="flex-1 rounded-xl bg-[#0078BD] py-2.5 text-sm font-bold text-white"
                >
                  Join Now
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;