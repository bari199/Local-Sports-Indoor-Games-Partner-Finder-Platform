import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Footer from "@/components/common/Footer";

import {
  Edit3,
  Loader2,
  UserRound,
  MapPin,
  Trophy,
  Mail,
  CircleCheck,
  CircleX,
} from "lucide-react";

import { toast } from "sonner";

import { getMyProfile } from "../../services/authService";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==================================================
  // STATE
  // ==================================================

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // LOAD PROFILE
  // ==================================================

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const response =
          await getMyProfile();

        if (!mounted) {
          return;
        }

        if (response?.success) {
          setUser(response.user);
        } else {
          toast.error(
            response?.message ||
              "Unable to load profile"
          );
        }
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error(
          "Load profile error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load profile"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [location.key]);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC]">
        <div className="flex min-h-[400px] items-center justify-center">

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <Loader2
              size={19}
              className="animate-spin text-[#0078BD]"
            />

            Loading profile...

          </div>

        </div>
      </main>
    );
  }

  // ==================================================
  // NO USER
  // ==================================================

  if (!user) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC]">
        <div className="flex min-h-[400px] items-center justify-center">

          <p className="text-sm text-slate-500">
            Profile not found.
          </p>

        </div>
      </main>
    );
  }

  // ==================================================
  // AVAILABILITY
  // ==================================================

  const isAvailable =
    user.availability ===
    "Available";

  const availabilityLabel =
    isAvailable
      ? "Available"
      : "Not Available";

  // ==================================================
  // UI
  // ==================================================

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC]">

      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6 flex items-center justify-between gap-4">

          <div className="min-w-0">

            <h1 className="text-2xl font-bold text-slate-900">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Your player profile and game preferences.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/profile/edit")
            }
            className="
              flex
              shrink-0
              items-center
              gap-2
              rounded-lg
              bg-[#0078BD]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#0069A7]
              focus:outline-none
              focus:ring-4
              focus:ring-[#0078BD]/15
            "
          >
            <Edit3 size={15} />

            <span className="hidden sm:inline">
              Edit Profile
            </span>

            <span className="sm:hidden">
              Edit
            </span>
          </button>

        </div>

        {/* ==================================================
            PROFILE CARD
        ================================================== */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          {/* ==================================================
              PROFILE HEADER
          ================================================== */}

          <div className="border-b border-slate-200 p-5 sm:p-7">

            <div className="flex items-center gap-4 sm:gap-5">

              {/* PROFILE IMAGE */}

              <div
                className="
                  h-20
                  w-20
                  shrink-0
                  overflow-hidden
                  rounded-full
                  bg-slate-100
                  ring-4
                  ring-slate-50
                "
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={
                      user.name ||
                      "Profile"
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserRound
                      size={34}
                      className="text-slate-300"
                    />
                  </div>
                )}
              </div>

              {/* BASIC INFO */}

              <div className="min-w-0 flex-1">

                <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                  {user.name ||
                    "No name"}
                </h2>

                <div className="mt-1.5 flex min-w-0 items-center gap-2 text-sm text-slate-500">

                  <Mail
                    size={14}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {user.email}
                  </span>

                </div>

                {user.location && (
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                    <MapPin
                      size={14}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {user.location}
                    </span>

                  </div>
                )}

              </div>

              {/* DESKTOP AVAILABILITY */}

              <div
                className={`
                  hidden
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-full
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  sm:flex
                  ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }
                `}
              >

                {isAvailable ? (
                  <CircleCheck size={14} />
                ) : (
                  <CircleX size={14} />
                )}

                {availabilityLabel}

              </div>

            </div>

            {/* MOBILE AVAILABILITY */}

            <div className="mt-4 sm:hidden">

              <span
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }
                `}
              >

                {isAvailable ? (
                  <CircleCheck size={14} />
                ) : (
                  <CircleX size={14} />
                )}

                {availabilityLabel}

              </span>

            </div>

          </div>

          {/* ==================================================
              PLAYER INFORMATION
          ================================================== */}

          <div className="border-b border-slate-200 p-5 sm:p-7">

            <h2 className="font-semibold text-slate-900">
              Player Information
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">

              {/* LOCATION */}

              <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">

                <div className="flex items-center gap-2">

                  <MapPin
                    size={16}
                    className="text-[#0078BD]"
                  />

                  <p className="text-xs font-medium text-slate-400">
                    Location
                  </p>

                </div>

                <p className="mt-2 truncate text-sm font-semibold text-slate-800">
                  {user.location ||
                    "Not specified"}
                </p>

              </div>

              {/* SKILL */}

              <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">

                <div className="flex items-center gap-2">

                  <Trophy
                    size={16}
                    className="text-[#0078BD]"
                  />

                  <p className="text-xs font-medium text-slate-400">
                    Skill Level
                  </p>

                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {user.skillLevel ||
                    "Beginner"}
                </p>

              </div>

              {/* AVAILABILITY */}

              
            </div>

          </div>

          {/* ==================================================
              PREFERRED GAMES
          ================================================== */}

          <div className="p-5 sm:p-7">

            <div>

              <h2 className="font-semibold text-slate-900">
                Preferred Games
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Games you enjoy playing.
              </p>

            </div>

            {Array.isArray(
              user.preferredGames
            ) &&
            user.preferredGames.length > 0 ? (

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                {user.preferredGames.map(
                  (game) => (

                    <div
                      key={game._id}
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-slate-200
                        p-3
                        transition
                        hover:border-slate-300
                      "
                    >

                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">

                        {game.image ? (
                          <img
                            src={game.image}
                            alt={
                              game.name
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Trophy
                              size={18}
                              className="text-slate-300"
                            />
                          </div>
                        )}

                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-slate-800">
                          {game.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {game.type ||
                            "Game"}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-6 text-center">

                <Trophy
                  size={26}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-2 text-sm text-slate-500">
                  No preferred games selected.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

      <Footer />

    </main>
  );
};

export default Profile;