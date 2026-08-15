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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 7 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-700">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0078BD] text-white">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Admin Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your SportsConnect platform
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0078BD]">
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-900">
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