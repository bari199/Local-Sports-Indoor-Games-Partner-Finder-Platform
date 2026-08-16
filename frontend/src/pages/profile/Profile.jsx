import { useEffect, useState } from "react";
import Footer from "@/components/common/Footer";
import {
  Camera,
  Edit3,
  Loader2,
  UserRound,
  MapPin,
  Trophy,
  Mail,
} from "lucide-react";

import { toast } from "sonner";

import { getMyProfile } from "../../services/authService";

const Profile = () => {
  // ==================================================
  // STATE
  // ==================================================

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // LOAD PROFILE
  // ==================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await getMyProfile();

        console.log("========== PROFILE ==========");

        console.log("Profile response:", response);

        if (response?.success) {
          setUser(response.user);
        } else {
          toast.error(response?.message || "Unable to load profile");
        }
      } catch (error) {
        console.error("========== LOAD PROFILE ERROR ==========");

        console.error("Error:", error);

        console.error("Status:", error?.response?.status);

        console.error("Response:", error?.response?.data);

        toast.error(error?.response?.data?.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={20} className="animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  // ==================================================
  // NO USER
  // ==================================================

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">Profile not found.</p>
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-5xl">
        {/* ============================================
          HEADER
      ============================================ */}

        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

            <p className="mt-1 text-sm text-slate-500">
              View your player profile and preferred games.
            </p>
          </div>

          {/* EDIT BUTTON */}

          <a
            href="/profile/edit"
            className="
            flex
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[#0078BD]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#0069A7]
          "
          >
            <Edit3 size={16} />
            Edit Profile
          </a>
        </div>

        {/* ============================================
          PROFILE CARD
      ============================================ */}

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
          {/* ==========================================
            PROFILE HEADER
        ========================================== */}

          <div
            className="
            border-b
            border-slate-200
            p-6
            sm:p-8
          "
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* PROFILE IMAGE */}

              <div
                className="
                relative
                h-24
                w-24
                shrink-0
                overflow-hidden
                rounded-full
                bg-slate-100
              "
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="
                    h-full
                    w-full
                    object-cover
                  "
                  />
                ) : (
                  <div
                    className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                  "
                  >
                    <UserRound size={40} className="text-slate-300" />
                  </div>
                )}
              </div>

              {/* USER BASIC INFO */}

              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900">
                  {user.name || "No name"}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={15} />

                  <span className="truncate">{user.email}</span>
                </div>

                {user.location && (
                  <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={15} />

                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==========================================
            BASIC INFORMATION
        ========================================== */}

          <div
            className="
            border-b
            border-slate-200
            p-6
            sm:p-8
          "
          >
            <h2 className="font-semibold text-slate-900">Player Information</h2>

            <div
              className="
              mt-5
              grid
              gap-4
              sm:grid-cols-2
            "
            >
              {/* LOCATION */}

              <div
                className="
                rounded-xl
                border
                border-slate-200
                p-4
              "
              >
                <div className="flex items-center gap-2">
                  <MapPin size={17} className="text-[#0078BD]" />

                  <p className="text-xs font-medium text-slate-400">Location</p>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {user.location || "Not specified"}
                </p>
              </div>

              {/* SKILL LEVEL */}

              <div
                className="
                rounded-xl
                border
                border-slate-200
                p-4
              "
              >
                <div className="flex items-center gap-2">
                  <Trophy size={17} className="text-[#0078BD]" />

                  <p className="text-xs font-medium text-slate-400">
                    Skill Level
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {user.skillLevel || "Beginner"}
                </p>
              </div>
            </div>
          </div>

          {/* ==========================================
            PREFERRED GAMES
        ========================================== */}

          <div className="p-6 sm:p-8">
            <h2 className="font-semibold text-slate-900">Preferred Games</h2>

            <p className="mt-1 text-sm text-slate-500">
              Games you enjoy playing.
            </p>

            {Array.isArray(user.preferredGames) &&
            user.preferredGames.length > 0 ? (
              <div
                className="
                mt-5
                grid
                gap-3
                sm:grid-cols-2
              "
              >
                {user.preferredGames.map((game) => (
                  <div
                    key={game._id}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-slate-200
                      p-3
                    "
                  >
                    {/* GAME IMAGE */}

                    <div
                      className="
                        h-12
                        w-12
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        bg-slate-100
                      "
                    >
                      {game.image ? (
                        <img
                          src={game.image}
                          alt={game.name}
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Trophy size={20} className="text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* GAME INFO */}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {game.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {game.type || "Game"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="
                mt-5
                rounded-xl
                border
                border-dashed
                border-slate-200
                p-6
                text-center
              "
              >
                <Trophy size={28} className="mx-auto text-slate-300" />

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
