import { useEffect, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  Trash2,
  ShieldCheck,
} from "lucide-react";

import {
  getAdminUsers,
  deleteAdminUser,
} from "@/services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================================
     FETCH USERS
  ============================================================ */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();

      if (data.success) {
        setUsers(data.users);
      } else {
        setError(
          data.message || "Failed to load users"
        );
      }
    } catch (error) {
      console.error("Admin users error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ============================================================
     DELETE USER
  ============================================================ */

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      const data = await deleteAdminUser(userId);

      if (data.success) {
        setUsers((prev) =>
          prev.filter(
            (user) => user._id !== userId
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  /* ============================================================
     SEARCH
  ============================================================ */

  const filteredUsers = users.filter((user) => {
    const searchValue =
      search.toLowerCase().trim();

    return (
      user.name
        ?.toLowerCase()
        .includes(searchValue) ||
      user.email
        ?.toLowerCase()
        .includes(searchValue) ||
      user.location
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Users
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage SportsConnect users
            </p>
          </div>

          {/* Search */}

          <div className="relative w-full sm:w-80">

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
              placeholder="Search users..."
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
            TABLE
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

          {/* Loading */}

          {loading ? (
            <div className="space-y-4 p-6">

              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="
                      h-14
                      animate-pulse
                      rounded-lg
                      bg-slate-100
                    "
                  />
                )
              )}

            </div>
          ) : filteredUsers.length === 0 ? (

            /* Empty */

            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                px-6
                py-16
                text-center
              "
            >

              <UsersEmpty />

              <h3
                className="
                  mt-4
                  text-lg
                  font-semibold
                  text-slate-800
                "
              >
                No users found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try another search term.
              </p>

            </div>
          ) : (

            /* Table */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[760px]">

                {/* ==================================================
                    TABLE HEADER
                ================================================== */}

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
                      User
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
                      Location
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
                      Skill
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
                      Role
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

                {/* ==================================================
                    TABLE BODY
                ================================================== */}

                <tbody>

                  {filteredUsers.map((user) => (

                    <tr
                      key={user._id}
                      className="
                        border-b
                        border-slate-100
                        last:border-0
                        hover:bg-slate-50/70
                      "
                    >

                      {/* ============================================
                          USER
                      ============================================ */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              overflow-hidden
                              rounded-full
                              bg-sky-50
                              text-[#0078BD]
                            "
                          >

                            {user.image ? (

                              <img
                                src={user.image}
                                alt={user.name}
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                "
                              />

                            ) : (

                              <UserRound size={18} />

                            )}

                          </div>

                          <div className="min-w-0">

                            <p
                              className="
                                truncate
                                font-semibold
                                text-slate-800
                              "
                            >
                              {user.name}
                            </p>

                            <p
                              className="
                                max-w-[220px]
                                truncate
                                text-xs
                                text-slate-500
                              "
                            >
                              {user.email}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ============================================
                          LOCATION
                      ============================================ */}

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          text-slate-600
                        "
                      >
                        {user.location || "—"}
                      </td>

                      {/* ============================================
                          SKILL
                      ============================================ */}

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          capitalize
                          text-slate-600
                        "
                      >
                        {user.skillLevel || "—"}
                      </td>

                      {/* ============================================
                          ROLE
                      ============================================ */}

                      <td className="px-6 py-4">

                        {user.role === "admin" ? (

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              border-blue-200
                              bg-blue-50
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-[#0078BD]
                            "
                          >
                            <ShieldCheck size={14} />
                            Admin
                          </span>

                        ) : (

                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-full
                              border
                              border-slate-200
                              bg-slate-50
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-slate-600
                            "
                          >
                            User
                          </span>

                        )}

                      </td>

                      {/* ============================================
                          ACTION
                      ============================================ */}

                      <td
                        className="
                          px-6
                          py-4
                          text-right
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(user._id)
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
                          title="Delete user"
                        >
                          <Trash2 size={17} />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

/* ================================================================
   EMPTY STATE
================================================================ */

const UsersEmpty = () => {
  return (
    <div
      className="
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-2xl
        bg-slate-100
        text-slate-400
      "
    >
      <Users size={24} />
    </div>
  );
};

export default AdminUsers;