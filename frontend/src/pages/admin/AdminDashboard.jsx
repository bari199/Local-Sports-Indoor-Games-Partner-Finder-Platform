import { useEffect, useState } from "react";
import {
  Users,
  Trophy,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  ShieldCheck,
} from "lucide-react";

import { getAdminDashboard } from "@/services/adminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboard();

        if (data.success) {
          setStats(data.stats);
        } else {
          setError(
            data.message || "Failed to load dashboard"
          );
        }
      } catch (error) {
        console.error(
          "Admin dashboard error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
    },
    {
      title: "Total Games",
      value: stats?.totalGames ?? 0,
      icon: Trophy,
    },
    {
      title: "Total Admins",
      value: stats?.totalAdmins ?? 0,
      icon: ShieldCheck,
    },
    {
      title: "Total Requests",
      value: stats?.totalRequests ?? 0,
      icon: UserCheck,
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests ?? 0,
      icon: Clock,
    },
    {
      title: "Accepted Requests",
      value: stats?.acceptedRequests ?? 0,
      icon: CheckCircle,
    },
    {
      title: "Rejected Requests",
      value: stats?.rejectedRequests ?? 0,
      icon: XCircle,
    },
  ];

  /* ============================================
     LOADING
  ============================================ */
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto w-full max-w-7xl">
          {/* Loading Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200 sm:h-11 sm:w-11" />

            <div className="space-y-2">
              <div className="h-6 w-44 animate-pulse rounded bg-slate-200 sm:h-7 sm:w-56" />

              <div className="h-3 w-56 animate-pulse rounded bg-slate-200 sm:w-72" />
            </div>
          </div>

          {/* Loading Cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 7 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    h-32
                    animate-pulse
                    rounded-2xl
                    bg-white
                    shadow-sm
                    sm:h-36
                  "
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ============================================
     ERROR
  ============================================ */
  if (error) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-6">
            <h2 className="text-base font-semibold text-red-700 sm:text-lg">
              Unable to load dashboard
            </h2>

            <p className="mt-2 break-words text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================
     DASHBOARD
  ============================================ */
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-5 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* ========================================
            HEADER
        ======================================== */}
        <div>
          <div className="flex items-center gap-3">
            {/* Icon */}
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
                sm:h-11
                sm:w-11
              "
            >
              <ShieldCheck
                size={21}
                className="sm:hidden"
              />

              <ShieldCheck
                size={23}
                className="hidden sm:block"
              />
            </div>

            {/* Title */}
            <div className="min-w-0">
              <h1
                className="
                  truncate
                  text-xl
                  font-bold
                  text-slate-900
                  sm:text-2xl
                "
              >
                Admin Dashboard
              </h1>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-500
                  sm:mt-1
                  sm:text-sm
                "
              >
                Manage your SportsConnect platform
              </p>
            </div>
          </div>
        </div>

        {/* ========================================
            STATS
        ======================================== */}
        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-4

            sm:mt-8
            sm:grid-cols-2
            sm:gap-5

            lg:grid-cols-4
          "
        >
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="
                  rounded-2xl
                  border
                  border-slate-100
                  bg-white
                  p-4
                  shadow-sm
                  transition
                  duration-200
                  hover:shadow-md

                  sm:p-5
                "
              >
                {/* Card Top */}
                <div className="flex items-center justify-between">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-sky-50
                      text-[#0078BD]

                      sm:h-11
                      sm:w-11
                    "
                  >
                    <Icon
                      size={20}
                      className="sm:hidden"
                    />

                    <Icon
                      size={21}
                      className="hidden sm:block"
                    />
                  </div>
                </div>

                {/* Card Title */}
                <p
                  className="
                    mt-4
                    text-sm
                    font-medium
                    text-slate-500

                    sm:mt-5
                  "
                >
                  {card.title}
                </p>

                {/* Card Value */}
                <h2
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    text-slate-900

                    sm:text-3xl
                  "
                >
                  {card.value}
                </h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;