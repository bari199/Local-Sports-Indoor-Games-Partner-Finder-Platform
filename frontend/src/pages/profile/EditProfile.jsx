import { useEffect, useState } from "react";

import {
  Camera,
  Check,
  Loader2,
  UserRound,
  ArrowLeft,
} from "lucide-react";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  getMyProfile,
  updateProfile,
} from "../../services/authService";

import { getGames } from "../../services/gameService";

const EditProfile = () => {
  const navigate = useNavigate();

  // ==================================================
  // STATE
  // ==================================================

  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");

  const [selectedGames, setSelectedGames] = useState([]);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==================================================
  // LOAD PROFILE + GAMES
  // ==================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [profileResponse, gamesResponse] =
          await Promise.all([
            getMyProfile(),
            getGames(),
          ]);

        // ============================================
        // PROFILE
        // ============================================

        if (profileResponse?.success) {
          const currentUser = profileResponse.user;

          setUser(currentUser);

          setName(currentUser?.name || "");

          setLocation(currentUser?.location || "");

          setSkillLevel(
            currentUser?.skillLevel || "Beginner"
          );

          setSelectedGames(
            (currentUser?.preferredGames || [])
              .map((game) => String(game?._id))
              .filter(Boolean)
          );

          setPreview(currentUser?.image || "");
        }

        // ============================================
        // GAMES
        // ============================================

        if (gamesResponse?.success) {
          setGames(gamesResponse.games || []);
        }
      } catch (error) {
        console.error("Load edit profile error:", error);

        toast.error(
          error?.response?.data?.message ||
            "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==================================================
  // IMAGE CHANGE
  // ==================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // IMAGE TYPE

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");

      event.target.value = "";
      return;
    }

    // IMAGE SIZE

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");

      event.target.value = "";
      return;
    }

    // OLD OBJECT URL

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    // STORE FILE

    setImage(file);

    // PREVIEW

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);
  };

  // ==================================================
  // CLEAN OBJECT URL
  // ==================================================

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ==================================================
  // TOGGLE GAME
  // ==================================================

  const toggleGame = (gameId) => {
    const id = String(gameId);

    setSelectedGames((current) => {
      if (current.includes(id)) {
        return current.filter(
          (selectedId) => selectedId !== id
        );
      }

      return [...current, id];
    });
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      // ============================================
      // FORM DATA
      // ============================================

      const formData = new FormData();

      formData.append("name", name.trim());

      formData.append(
        "location",
        location.trim()
      );

      formData.append(
        "skillLevel",
        skillLevel
      );

      formData.append(
        "preferredGames",
        JSON.stringify(selectedGames)
      );

      // ONLY SEND NEW IMAGE

      if (image instanceof File) {
        formData.append("image", image);
      }

      // ============================================
      // API
      // ============================================

      const response = await updateProfile(formData);

      if (!response?.success) {
        toast.error(
          response?.message ||
            "Unable to update profile"
        );

        return;
      }

      // ============================================
      // SUCCESS
      // ============================================

      const updatedUser = response.user;

      setUser(updatedUser);

      setName(updatedUser?.name || "");

      setLocation(updatedUser?.location || "");

      setSkillLevel(
        updatedUser?.skillLevel || "Beginner"
      );

      setSelectedGames(
        (updatedUser?.preferredGames || [])
          .map((game) => String(game?._id))
          .filter(Boolean)
      );

      setPreview(updatedUser?.image || "");

      setImage(null);

      toast.success(
        "Profile updated successfully"
      );

      // ============================================
      // GO BACK TO PROFILE
      // ============================================

      navigate("/profile");
    } catch (error) {
      console.error(
        "========== UPDATE PROFILE ERROR =========="
      );

      console.error("Error:", error);

      console.error(
        "Status:",
        error?.response?.status
      );

      console.error(
        "Response:",
        error?.response?.data
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#0078BD]" />
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="mx-auto max-w-4xl">
      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="
              mb-3
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition
              hover:text-[#0078BD]
            "
          >
            <ArrowLeft size={16} />
            Back to Profile
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Edit Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update your player profile information.
          </p>
        </div>
      </div>

      {/* ============================================= */}
      {/* FORM */}
      {/* ============================================= */}

      <form
        onSubmit={handleSubmit}
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        {/* =========================================== */}
        {/* PROFILE PHOTO */}
        {/* =========================================== */}

        <div className="border-b border-slate-200 p-6 sm:p-8">
          <h2 className="font-semibold text-slate-900">
            Profile Photo
          </h2>

          <div className="mt-5 flex items-center gap-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-slate-100">
              {preview ? (
                <img
                  src={preview}
                  alt={name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <UserRound
                    size={38}
                    className="text-slate-300"
                  />
                </div>
              )}

              <label
                className="
                  absolute
                  bottom-0
                  right-0
                  flex
                  h-8
                  w-8
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  bg-[#0078BD]
                  text-white
                  shadow
                  transition
                  hover:bg-[#0069A7]
                "
              >
                <Camera size={15} />

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={saving}
                />
              </label>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Change profile photo
              </p>

              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG or WEBP · Max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* =========================================== */}
        {/* BASIC INFORMATION */}
        {/* =========================================== */}

        <div className="border-b border-slate-200 p-6 sm:p-8">
          <h2 className="font-semibold text-slate-900">
            Basic Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
                disabled={saving}
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-[#0078BD]
                  focus:ring-2
                  focus:ring-[#0078BD]/10
                  disabled:bg-slate-50
                "
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                value={user?.email || ""}
                disabled
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  text-sm
                  text-slate-400
                "
              />
            </div>

            {/* LOCATION */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Location
              </label>

              <input
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="e.g. Kolkata"
                disabled={saving}
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-[#0078BD]
                  focus:ring-2
                  focus:ring-[#0078BD]/10
                  disabled:bg-slate-50
                "
              />
            </div>

            {/* SKILL */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Skill Level
              </label>

              <select
                value={skillLevel}
                onChange={(event) =>
                  setSkillLevel(event.target.value)
                }
                disabled={saving}
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  outline-none
                  focus:border-[#0078BD]
                  focus:ring-2
                  focus:ring-[#0078BD]/10
                  disabled:bg-slate-50
                "
              >
                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* =========================================== */}
        {/* PREFERRED GAMES */}
        {/* =========================================== */}

        <div className="border-b border-slate-200 p-6 sm:p-8">
          <h2 className="font-semibold text-slate-900">
            Preferred Games
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select the games you enjoy playing.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {games.map((game) => {
              const gameId = String(game._id);

              const selected =
                selectedGames.includes(gameId);

              return (
                <button
                  type="button"
                  key={game._id}
                  disabled={saving}
                  onClick={() =>
                    toggleGame(game._id)
                  }
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    p-3
                    text-left
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${
                      selected
                        ? "border-[#0078BD] bg-[#0078BD]/5"
                        : "border-slate-200 hover:border-slate-300"
                    }
                  `}
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-100" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {game.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {game.type}
                    </p>
                  </div>

                  {selected && (
                    <Check
                      size={18}
                      className="ml-auto shrink-0 text-[#0078BD]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================== */}
        {/* SAVE */}
        {/* =========================================== */}

        <div className="flex justify-end gap-3 p-6 sm:p-8">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            disabled={saving}
            className="
              rounded-lg
              border
              border-slate-200
              px-5
              py-2.5
              text-sm
              font-semibold
              text-slate-600
              transition
              hover:bg-slate-50
              disabled:opacity-60
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[#0078BD]
              px-6
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#0069A7]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {saving ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Check size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;