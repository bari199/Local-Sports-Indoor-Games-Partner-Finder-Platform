import { useEffect, useState } from "react";

import {
  Users,
  Trophy,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getAdminDashboard } from "@/services/adminService";

const PIE_COLORS = [
  "#0078BD",
  "#22C55E",
  "#EF4444",
];

const INITIAL_ANALYTICS = {
  userGrowth: [],
  requestGrowth: [],
  requestStatus: [],
  gamePreferences: [],
  requestsByGame: [],
};

/* ============================================================
   DUMMY ANALYTICS DATA
   Used only when backend analytics data is unavailable.
============================================================ */

const DUMMY_ANALYTICS = {
  userGrowth: [
    { month: "Jan", users: 12 },
    { month: "Feb", users: 18 },
    { month: "Mar", users: 27 },
    { month: "Apr", users: 35 },
    { month: "May", users: 48 },
    { month: "Jun", users: 62 },
  ],

  requestGrowth: [
    { month: "Jan", requests: 8 },
    { month: "Feb", requests: 14 },
    { month: "Mar", requests: 19 },
    { month: "Apr", requests: 26 },
    { month: "May", requests: 34 },
    { month: "Jun", requests: 41 },
  ],

  requestStatus: [
    {
      name: "Pending",
      value: 18,
    },
    {
      name: "Accepted",
      value: 42,
    },
    {
      name: "Rejected",
      value: 9,
    },
  ],

  gamePreferences: [
    {
      name: "Football",
      users: 38,
    },
    {
      name: "Cricket",
      users: 31,
    },
    {
      name: "Badminton",
      users: 24,
    },
    {
      name: "Tennis",
      users: 19,
    },
    {
      name: "Basketball",
      users: 14,
    },
  ],

  requestsByGame: [
    {
      name: "Football",
      requests: 25,
    },
    {
      name: "Cricket",
      requests: 21,
    },
    {
      name: "Badminton",
      requests: 16,
    },
    {
      name: "Tennis",
      requests: 12,
    },
    {
      name: "Basketball",
      requests: 8,
    },
  ],
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  const [analytics, setAnalytics] =
    useState(INITIAL_ANALYTICS);

  const [recent, setRecent] = useState({
    users: [],
    requests: [],
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  /* ============================================================
     FETCH DASHBOARD
  ============================================================ */

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAdminDashboard();

      console.log(
        "ADMIN DASHBOARD RESPONSE:",
        data
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to load dashboard"
        );
      }

      /* --------------------------------------------------------
         STATS
      -------------------------------------------------------- */

      setStats(data.stats || {});

      /* --------------------------------------------------------
         ANALYTICS

         Backend data gets priority.
         Dummy data is used when backend arrays are empty.
      -------------------------------------------------------- */

      setAnalytics({
        userGrowth:
          data.analytics?.userGrowth?.length > 0
            ? data.analytics.userGrowth
            : DUMMY_ANALYTICS.userGrowth,

        requestGrowth:
          data.analytics?.requestGrowth?.length > 0
            ? data.analytics.requestGrowth
            : DUMMY_ANALYTICS.requestGrowth,

        requestStatus:
          data.analytics?.requestStatus?.length > 0
            ? data.analytics.requestStatus
            : DUMMY_ANALYTICS.requestStatus,

        gamePreferences:
          data.analytics?.gamePreferences?.length > 0
            ? data.analytics.gamePreferences
            : DUMMY_ANALYTICS.gamePreferences,

        requestsByGame:
          data.analytics?.requestsByGame?.length > 0
            ? data.analytics.requestsByGame
            : DUMMY_ANALYTICS.requestsByGame,
      });

      /* --------------------------------------------------------
         RECENT DATA
      -------------------------------------------------------- */

      setRecent({
        users:
          data.recent?.users || [],

        requests:
          data.recent?.requests || [],
      });
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     INITIAL LOAD
  ============================================================ */

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ============================================================
     STAT CARDS
  ============================================================ */

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

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-8 w-56 rounded-lg bg-slate-200" />

          <div className="mt-2 h-4 w-72 rounded bg-slate-200" />

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 7,
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl bg-white"
              />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="h-80 rounded-2xl bg-white" />
            <div className="h-80 rounded-2xl bg-white" />
          </div>

        </div>
      </div>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="font-bold text-red-700">
                  Unable to load dashboard
                </h2>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={fetchDashboard}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                <RefreshCw size={16} />
                Retry
              </button>

            </div>

          </div>

        </div>
      </div>
    );
  }

  /* ============================================================
     DASHBOARD
  ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">

      <div className="mx-auto w-full max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0078BD] text-white shadow-sm">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Admin Dashboard
              </h1>

              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Manage and monitor your SportsConnect platform
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={fetchDashboard}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:border-[#0078BD]/30 hover:text-[#0078BD] sm:w-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

        </div>

        {/* ======================================================
            STAT CARDS
        ====================================================== */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0078BD]">
                  <Icon size={21} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {card.value}
                </h2>

              </div>
            );
          })}

        </div>

        {/* ======================================================
            ANALYTICS TITLE
        ====================================================== */}

        <div className="mt-8">

          <div className="flex flex-wrap items-center gap-2">

            <BarChart3
              size={20}
              className="text-[#0078BD]"
            />

            <h2 className="text-lg font-bold text-slate-900">
              Platform Analytics
            </h2>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
              Demo Data
            </span>

          </div>

          <p className="mt-1 text-sm text-slate-500">
            Monitor users, requests and game activity
          </p>

        </div>

        {/* ======================================================
            USER + REQUEST GROWTH
        ====================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* USER GROWTH */}

          <AnalyticsCard
            title="User Growth"
            subtitle="New users registered over time"
            icon={<TrendingUp size={18} />}
          >
            {analytics.userGrowth.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={analytics.userGrowth}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Users"
                    stroke="#0078BD"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                </LineChart>

              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No user growth data available yet." />
            )}
          </AnalyticsCard>

          {/* REQUEST GROWTH */}

          <AnalyticsCard
            title="Partner Requests"
            subtitle="Partner requests created over time"
            icon={<UserCheck size={18} />}
          >
            {analytics.requestGrowth.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={analytics.requestGrowth}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="requests"
                    name="Requests"
                    fill="#0078BD"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No partner request growth data available yet." />
            )}
          </AnalyticsCard>

        </div>

        {/* ======================================================
            REQUEST STATUS + GAME PREFERENCES
        ====================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* REQUEST STATUS */}

          <AnalyticsCard
            title="Request Status"
            subtitle="Current partner request distribution"
            icon={<PieChartIcon size={18} />}
          >

            {analytics.requestStatus.some(
              (item) => item.value > 0
            ) ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={analytics.requestStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius="70%"
                    innerRadius="45%"
                    paddingAngle={3}
                  >

                    {analytics.requestStatus.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PIE_COLORS[
                              index %
                                PIE_COLORS.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    height={30}
                  />

                </PieChart>

              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No partner request data available yet." />
            )}

          </AnalyticsCard>

          {/* GAME PREFERENCES */}

          <AnalyticsCard
            title="Popular Games"
            subtitle="Games selected by users"
            icon={<Trophy size={18} />}
          >

            {analytics.gamePreferences.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={analytics.gamePreferences}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="users"
                    name="Users"
                    fill="#0078BD"
                    radius={[0, 6, 6, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No game preference data available yet." />
            )}

          </AnalyticsCard>

        </div>

        {/* ======================================================
            REQUESTS BY GAME
        ====================================================== */}

        <div className="mt-5">

          <AnalyticsCard
            title="Requests by Game"
            subtitle="Games generating the most partner requests"
            icon={<BarChart3 size={18} />}
          >

            {analytics.requestsByGame.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={analytics.requestsByGame}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="requests"
                    name="Requests"
                    fill="#0078BD"
                    radius={[0, 6, 6, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No game request data available yet." />
            )}

          </AnalyticsCard>

        </div>

        {/* ======================================================
            PLATFORM SUMMARY
        ====================================================== */}

        <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-2">

            <Trophy
              size={18}
              className="text-[#0078BD]"
            />

            <h3 className="font-bold text-slate-900">
              Platform Summary
            </h3>

          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

            <SummaryItem
              label="Acceptance Rate"
              value={
                stats?.totalRequests
                  ? `${Math.round(
                      (stats.acceptedRequests /
                        stats.totalRequests) *
                        100
                    )}%`
                  : "0%"
              }
            />

            <SummaryItem
              label="Pending Rate"
              value={
                stats?.totalRequests
                  ? `${Math.round(
                      (stats.pendingRequests /
                        stats.totalRequests) *
                        100
                    )}%`
                  : "0%"
              }
            />

            <SummaryItem
              label="Users / Game"
              value={
                stats?.totalGames
                  ? (
                      stats.totalUsers /
                      stats.totalGames
                    ).toFixed(1)
                  : "0"
              }
            />

          </div>

        </div>

        {/* ======================================================
            RECENT USERS
        ====================================================== */}

        {recent.users.length > 0 && (
          <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-2">

              <Users
                size={18}
                className="text-[#0078BD]"
              />

              <h3 className="font-bold text-slate-900">
                Recent Users
              </h3>

            </div>

            <div className="mt-4 divide-y divide-slate-100">

              {recent.users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 py-3"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-50 text-sm font-bold text-[#0078BD]">

                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name
                        ?.charAt(0)
                        ?.toUpperCase()
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {user.location ||
                        "Location not provided"}
                    </p>

                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    {user.skillLevel}
                  </span>

                </div>
              ))}

            </div>

          </div>
        )}

        {/* ======================================================
            RECENT REQUESTS
        ====================================================== */}

        {recent.requests.length > 0 && (
          <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-2">

              <UserCheck
                size={18}
                className="text-[#0078BD]"
              />

              <h3 className="font-bold text-slate-900">
                Recent Partner Requests
              </h3>

            </div>

            <div className="mt-4 divide-y divide-slate-100">

              {recent.requests.map(
                (request) => (
                  <div
                    key={request._id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>

                      <p className="text-sm font-semibold text-slate-900">
                        {request.sender?.name ||
                          "Unknown"}{" "}
                        →{" "}
                        {request.receiver?.name ||
                          "Unknown"}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {request.game?.name ||
                          "Unknown game"}
                      </p>

                    </div>

                    <RequestStatus
                      status={request.status}
                    />

                  </div>
                )
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

/* ============================================================
   ANALYTICS CARD
============================================================ */

const AnalyticsCard = ({
  title,
  subtitle,
  icon,
  children,
}) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">

      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#0078BD]">
          {icon}
        </div>

        <div>

          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-400">
            {subtitle}
          </p>

        </div>

      </div>

      <div className="mt-5 h-[280px] w-full sm:h-[320px]">
        {children}
      </div>

    </div>
  );
};

/* ============================================================
   EMPTY CHART
============================================================ */

const EmptyChart = ({ message }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
        <BarChart3 size={22} />
      </div>

      <p className="mt-3 max-w-xs text-sm text-slate-400">
        {message}
      </p>

    </div>
  );
};

/* ============================================================
   SUMMARY ITEM
============================================================ */

const SummaryItem = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
};

/* ============================================================
   REQUEST STATUS
============================================================ */

const RequestStatus = ({ status }) => {
  const styles = {
    pending:
      "bg-amber-50 text-amber-600",

    accepted:
      "bg-green-50 text-green-600",

    rejected:
      "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ||
        "bg-slate-100 text-slate-500"
      }`}
    >
      {status
        ?.charAt(0)
        ?.toUpperCase() +
        status?.slice(1)}
    </span>
  );
};

export default AdminDashboard;