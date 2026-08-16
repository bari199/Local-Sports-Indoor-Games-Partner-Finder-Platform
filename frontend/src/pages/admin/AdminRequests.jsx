import { useEffect, useState } from "react";
import {
  Search,
  UserRound,
  Clock,
  Trash2,
} from "lucide-react";

import {
  getAdminRequests,
  deleteAdminRequest,
} from "@/services/adminService";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================================
     FETCH REQUESTS
  ============================================================ */

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminRequests();

      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setError(
          data.message || "Failed to load requests"
        );
      }
    } catch (error) {
      console.error(
        "Admin requests error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ============================================================
     DELETE REQUEST
     Admin can delete request.
     Admin CANNOT accept/reject request.
  ============================================================ */

  const handleDelete = async (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this request?"
    );

    if (!confirmed) return;

    try {
      const data = await deleteAdminRequest(
        requestId
      );

      if (data.success) {
        setRequests((prev) =>
          prev.filter(
            (request) =>
              request._id !== requestId
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete request error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete request"
      );
    }
  };

  /* ============================================================
     USER NAME
  ============================================================ */

  const getUserName = (user) => {
    if (!user) return "Unknown User";

    return user.name || "Unknown User";
  };

  /* ============================================================
     FILTER + SEARCH
  ============================================================ */

  const filteredRequests = requests.filter(
    (request) => {
      const searchValue =
        search.toLowerCase().trim();

      const senderName = getUserName(
        request.sender
      ).toLowerCase();

      const receiverName = getUserName(
        request.receiver
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        senderName.includes(searchValue) ||
        receiverName.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        request.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  /* ============================================================
     STATUS BADGE
  ============================================================ */

  const statusClasses = {
    pending:
      "border-amber-200 bg-amber-50 text-amber-700",

    accepted:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    rejected:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Partner Requests
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor player connection requests
          </p>
        </div>

        {/* ======================================================
            FILTERS
        ====================================================== */}

        <div className="mt-6 flex flex-col gap-3 lg:flex-row">

          {/* Search */}

          <div className="relative flex-1 lg:max-w-md">
            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by user name..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                py-3
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                focus:border-[#0078BD]
                focus:ring-2
                focus:ring-sky-100
              "
            />
          </div>

          {/* Status Filter */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              text-slate-600
              outline-none
              focus:border-[#0078BD]
            "
          >
            <option value="all">
              All Requests
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="accepted">
              Accepted
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>
        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              p-4
              text-sm
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {/* ======================================================
            REQUEST TABLE
        ====================================================== */}

        <div
          className="
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-slate-100
            bg-white
            shadow-sm
          "
        >
          {/* ====================================================
              LOADING
          ==================================================== */}

          {loading ? (
            <div className="space-y-4 p-6">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div
                  key={index}
                  className="
                    h-20
                    animate-pulse
                    rounded-xl
                    bg-slate-100
                  "
                />
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (

            /* ==================================================
               EMPTY
            ================================================== */

            <div className="px-6 py-16 text-center">
              <UserRound
                size={34}
                className="mx-auto text-slate-300"
              />

              <h3
                className="
                  mt-4
                  font-semibold
                  text-slate-800
                "
              >
                No requests found
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                No partner requests match
                your filters.
              </p>
            </div>
          ) : (

            /* ==================================================
               TABLE
            ================================================== */

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">

                {/* =================================================
                   TABLE HEADER
                ================================================= */}

                <thead>
                  <tr
                    className="
                      border-b
                      border-slate-100
                      bg-slate-50
                    "
                  >
                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Sender
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Receiver
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Date
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-right
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                {/* =================================================
                   TABLE BODY
                ================================================= */}

                <tbody>
                  {filteredRequests.map(
                    (request) => (
                      <tr
                        key={request._id}
                        className="
                          border-b
                          border-slate-100
                          last:border-0
                          hover:bg-slate-50/70
                        "
                      >

                        {/* ==========================================
                           SENDER
                        ========================================== */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">

                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-full
                                bg-sky-50
                                text-[#0078BD]
                              "
                            >
                              {request.sender?.image ? (
                                <img
                                  src={
                                    request.sender.image
                                  }
                                  alt={
                                    request.sender.name
                                  }
                                  className="
                                    h-full
                                    w-full
                                    object-cover
                                  "
                                />
                              ) : (
                                <UserRound
                                  size={17}
                                />
                              )}
                            </div>

                            <div>
                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-slate-800
                                "
                              >
                                {getUserName(
                                  request.sender
                                )}
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {request.sender
                                  ?.email || "—"}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* ==========================================
                           RECEIVER
                        ========================================== */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">

                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-full
                                bg-slate-100
                                text-slate-500
                              "
                            >
                              {request.receiver?.image ? (
                                <img
                                  src={
                                    request.receiver.image
                                  }
                                  alt={
                                    request.receiver.name
                                  }
                                  className="
                                    h-full
                                    w-full
                                    object-cover
                                  "
                                />
                              ) : (
                                <UserRound
                                  size={17}
                                />
                              )}
                            </div>

                            <div>
                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-slate-800
                                "
                              >
                                {getUserName(
                                  request.receiver
                                )}
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {request.receiver
                                  ?.email || "—"}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* ==========================================
                           STATUS
                           ADMIN HAS NO AUTHORITY TO CHANGE IT
                        ========================================== */}

                        <td className="px-6 py-4">
                          <span
                            className={`
                              inline-flex
                              items-center
                              rounded-full
                              border
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              capitalize
                              ${
                                statusClasses[
                                  request.status
                                ] ||
                                "border-slate-200 bg-slate-50 text-slate-600"
                              }
                            `}
                          >
                            {request.status ||
                              "Unknown"}
                          </span>
                        </td>

                        {/* ==========================================
                           DATE
                        ========================================== */}

                        <td className="px-6 py-4">
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-sm
                              text-slate-500
                            "
                          >
                            <Clock size={15} />

                            {request.createdAt
                              ? new Date(
                                  request.createdAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </div>
                        </td>

                        {/* ==========================================
                           DELETE
                        ========================================== */}

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                request._id
                              )
                            }
                            className="
                              inline-flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              text-slate-400
                              transition
                              hover:bg-red-50
                              hover:text-red-600
                            "
                            title="Delete request"
                          >
                            <Trash2 size={17} />
                          </button>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRequests;