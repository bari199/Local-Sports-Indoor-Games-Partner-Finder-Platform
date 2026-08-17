import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Camera,
  Check,
  Loader2,
  UserRound,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

import { toast } from "sonner";

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

  const [availability, setAvailability] =
    useState("Available");

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

        const [
          profileResponse,
          gamesResponse,
        ] = await Promise.all([
          getMyProfile(),
          getGames(),
        ]);

        // ==================================================
        // PROFILE
        // ==================================================

        if (profileResponse?.success) {
          const currentUser =
            profileResponse.user;

          console.log(
            "========== PROFILE LOADED =========="
          );

          console.log(
            "Current user:",
            currentUser
          );

          console.log(
            "Current availability:",
            currentUser?.availability
          );

          console.log(
            "Availability type:",
            typeof currentUser?.availability
          );

          console.log(
            "===================================="
          );

          setUser(currentUser);

          setName(
            currentUser?.name || ""
          );

          setLocation(
            currentUser?.location || ""
          );

          setSkillLevel(
            currentUser?.skillLevel ||
              "Beginner"
          );

          // ==================================================
          // AVAILABILITY
          // ==================================================

          

          // ==================================================
          // PREFERRED GAMES
          // ==================================================

          setSelectedGames(
            (
              currentUser?.preferredGames ||
              []
            )
              .map((game) =>
                String(game?._id)
              )
              .filter(Boolean)
          );

          // ==================================================
          // PROFILE IMAGE
          // ==================================================

          setPreview(
            currentUser?.image || ""
          );
        } else {
          toast.error(
            profileResponse?.message ||
              "Unable to load profile"
          );
        }

        // ==================================================
        // GAMES
        // ==================================================

        if (gamesResponse?.success) {
          setGames(
            gamesResponse.games || []
          );
        } else {
          toast.error(
            gamesResponse?.message ||
              "Unable to load games"
          );
        }
      } catch (error) {
        console.error(
          "Load edit profile error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
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
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // ==================================================
    // IMAGE TYPE VALIDATION
    // ==================================================

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select an image file"
      );

      event.target.value = "";
      return;
    }

    // ==================================================
    // IMAGE SIZE VALIDATION
    // ==================================================

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image must be less than 5MB"
      );

      event.target.value = "";
      return;
    }

    // ==================================================
    // CLEAN OLD OBJECT URL
    // ==================================================

    if (
      preview?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    // ==================================================
    // CREATE PREVIEW
    // ==================================================

    const objectUrl =
      URL.createObjectURL(file);

    setImage(file);
    setPreview(objectUrl);
  };

  // ==================================================
  // CLEAN OBJECT URL
  // ==================================================

  useEffect(() => {
    return () => {
      if (
        preview?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ==================================================
  // GAME SELECTION
  // ==================================================

  const toggleGame = (gameId) => {
    const id = String(gameId);

    setSelectedGames((current) => {
      if (current.includes(id)) {
        return current.filter(
          (selectedId) =>
            selectedId !== id
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

    // ==================================================
    // NAME VALIDATION
    // ==================================================

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    // ==================================================
    // AVAILABILITY VALIDATION
    // ==================================================

    const allowedAvailability = [
      "Available",
      "Not Available",
    ];

    if (
      !allowedAvailability.includes(
        availability
      )
    ) {
      console.error(
        "Invalid availability before submit:",
        availability
      );

      toast.error(
        "Invalid availability status"
      );

      return;
    }

    try {
      setSaving(true);

      // ==================================================
      // FORM DATA
      // ==================================================

      const formData = new FormData();

      // ==================================================
      // BASIC INFORMATION
      // ==================================================

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "location",
        location.trim()
      );

      formData.append(
        "skillLevel",
        skillLevel
      );



      // ==================================================
      // PREFERRED GAMES
      // ==================================================

      formData.append(
        "preferredGames",
        JSON.stringify(
          selectedGames
        )
      );

      // ==================================================
      // IMAGE
      // ONLY SEND NEW IMAGE
      // ==================================================

      if (image instanceof File) {
        formData.append(
          "image",
          image
        );
      }

      // ==================================================
      // DEBUG FORM DATA
      // ==================================================

      console.log(
        "========== UPDATE PROFILE =========="
      );

      console.log(
        "Name:",
        name.trim()
      );

      console.log(
        "Location:",
        location.trim()
      );

      console.log(
        "Skill Level:",
        skillLevel
      );

      console.log(
        "Preferred Games:",
        selectedGames
      );

      console.log(
        "Image:",
        image instanceof File
          ? image.name
          : "No new image"
      );

      console.log(
        "===================================="
      );

      // ==================================================
      // VERIFY FORMDATA
      // ==================================================

      console.log(
        "========== FORMDATA =========="
      );

      for (
        const [key, value]
        of formData.entries()
      ) {
        if (value instanceof File) {
          console.log(
            key,
            ":",
            value.name
          );
        } else {
          console.log(
            key,
            ":",
            value
          );
        }
      }

      console.log(
        "=============================="
      );

      // ==================================================
      // API REQUEST
      // ==================================================

      const response =
        await updateProfile(
          formData
        );

      // ==================================================
      // RESPONSE DEBUG
      // ==================================================

      console.log(
        "========== API RESPONSE =========="
      );

      console.log(
        "Update profile response:",
        response
      );

      console.log(
        "Response success:",
        response?.success
      );

      console.log(
        "Response user:",
        response?.user
      );

      

      console.log(
        "==================================="
      );

      // ==================================================
      // API ERROR RESPONSE
      // ==================================================

      if (!response?.success) {
        toast.error(
          response?.message ||
            "Unable to update profile"
        );

        return;
      }

      // ==================================================
      // GET UPDATED USER
      // ==================================================

      const updatedUser =
        response.user;

      if (!updatedUser) {
        toast.error(
          "Profile updated but user data was not returned"
        );

        return;
      }

      // ==================================================
      // VERIFY AVAILABILITY
      // ==================================================

      console.log(
        "========== UPDATED USER =========="
      );

      console.log(
        "Full updated user:",
        updatedUser
      );

      console.log(
        "Saved availability:",
        updatedUser.availability
      );

      console.log(
        "Saved availability type:",
        typeof updatedUser.availability
      );

      console.log(
        "=================================="
      );

      
      setUser(updatedUser);

      // ==================================================
      // UPDATE NAME
      // ==================================================

      setName(
        updatedUser.name || ""
      );

      // ==================================================
      // UPDATE LOCATION
      // ==================================================

      setLocation(
        updatedUser.location || ""
      );

      // ==================================================
      // UPDATE SKILL LEVEL
      // ==================================================

      setSkillLevel(
        updatedUser.skillLevel ||
          "Beginner"
      );

    
      // ==================================================
      // UPDATE PREFERRED GAMES
      // ==================================================

      setSelectedGames(
        (
          updatedUser.preferredGames ||
          []
        )
          .map((game) =>
            String(game?._id)
          )
          .filter(Boolean)
      );

      // ==================================================
      // UPDATE PROFILE IMAGE
      // ==================================================

      setPreview(
        updatedUser.image || ""
      );

      // ==================================================
      // CLEAR NEW IMAGE
      // ==================================================

      setImage(null);

      // ==================================================
      // SUCCESS
      // ==================================================

      toast.success(
        "Profile updated successfully"
      );

      // ==================================================
      // NAVIGATE TO PROFILE
      // ==================================================

      navigate("/profile", {
        replace: true,
        state: {
          profileUpdated: true,
        },
      });
    } catch (error) {
      console.error(
        "Update profile error:",
        error
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
      <div className="flex min-h-[400px] items-center justify-center overflow-x-hidden">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2
            size={19}
            className="animate-spin text-[#0078BD]"
          />

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
      <div className="flex min-h-[400px] items-center justify-center overflow-x-hidden">
        <p className="text-sm text-slate-500">
          Profile not found.
        </p>
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              navigate("/profile")
            }
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
            Update your player profile.
          </p>
        </div>

        {/* ==================================================
            FORM
        ================================================== */}

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

          {/* ==================================================
              PROFILE PHOTO
          ================================================== */}

          <section className="border-b border-slate-200 p-5 sm:p-7">
            <h2 className="font-semibold text-slate-900">
              Profile Photo
            </h2>

            <div className="mt-4 flex items-center gap-4">

              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-4 ring-slate-50">

                {preview ? (
                  <img
                    src={preview}
                    alt={
                      name ||
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

                <label
                  className="
                    absolute
                    bottom-0
                    right-0
                    flex
                    h-7
                    w-7
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full
                    bg-[#0078BD]
                    text-white
                    shadow
                    ring-2
                    ring-white
                    transition
                    hover:bg-[#0069A7]
                  "
                >
                  <Camera size={13} />

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={
                      handleImageChange
                    }
                    disabled={saving}
                  />
                </label>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700">
                  Change profile photo
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  JPG, PNG or WEBP · Max 5MB
                </p>
              </div>
            </div>
          </section>

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <section className="border-b border-slate-200 p-5 sm:p-7">

            <h2 className="font-semibold text-slate-900">
              Basic Information
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  required
                  disabled={saving}
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    px-3
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    focus:border-[#0078BD]
                    focus:ring-2
                    focus:ring-[#0078BD]/10
                    disabled:bg-slate-50
                  "
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  value={
                    user?.email || ""
                  }
                  disabled
                  className="
                    h-10
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Location
                </label>

                <input
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Kolkata"
                  disabled={saving}
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    px-3
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    focus:border-[#0078BD]
                    focus:ring-2
                    focus:ring-[#0078BD]/10
                    disabled:bg-slate-50
                  "
                />
              </div>

              {/* SKILL */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Skill Level
                </label>

                <div className="relative">

                  <select
                    value={skillLevel}
                    onChange={(event) =>
                      setSkillLevel(
                        event.target.value
                      )
                    }
                    disabled={saving}
                    className="
                      h-10
                      w-full
                      appearance-none
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3
                      pr-9
                      text-sm
                      text-slate-800
                      outline-none
                      transition
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

                  <ChevronDown
                    size={15}
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />
                </div>
              </div>

              {/* AVAILABILITY */}

              
            </div>
          </section>

          {/* ==================================================
              PREFERRED GAMES
          ================================================== */}

          <section className="border-b border-slate-200 p-5 sm:p-7">

            <h2 className="font-semibold text-slate-900">
              Preferred Games
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the games you enjoy playing.
            </p>

            {games.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">

                {games.map((game) => {
                  const gameId =
                    String(game._id);

                  const selected =
                    selectedGames.includes(
                      gameId
                    );

                  return (
                    <button
                      type="button"
                      key={game._id}
                      disabled={saving}
                      onClick={() =>
                        toggleGame(
                          game._id
                        )
                      }
                      className={`
                        group
                        relative
                        min-w-0
                        overflow-hidden
                        rounded-xl
                        border
                        bg-white
                        text-left
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        ${
                          selected
                            ? "border-[#0078BD] bg-[#0078BD]/5 ring-2 ring-[#0078BD]/10"
                            : "border-slate-200 hover:border-[#0078BD]/40"
                        }
                      `}
                    >
                      <div className="aspect-[1.5/1] overflow-hidden bg-slate-100">

                        {game.image ? (
                          <img
                            src={game.image}
                            alt={
                              game.name
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                              transition
                              duration-300
                              group-hover:scale-105
                            "
                          />
                        ) : (
                          <div className="h-full w-full bg-slate-100" />
                        )}
                      </div>

                      <div className="p-2.5">

                        <p className="truncate text-xs font-semibold text-slate-800">
                          {game.name}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-slate-400">
                          {game.type ||
                            "Game"}
                        </p>

                      </div>

                      {selected && (
                        <div
                          className="
                            absolute
                            right-1.5
                            top-1.5
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-[#0078BD]
                            text-white
                            shadow
                          "
                        >
                          <Check size={11} />
                        </div>
                      )}
                    </button>
                  );
                })}

              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-6 text-center">

                <p className="text-sm text-slate-500">
                  No games available.
                </p>

              </div>
            )}

          </section>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="flex flex-col-reverse gap-2.5 p-5 sm:flex-row sm:justify-end sm:p-7">

            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
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
                shadow-sm
                transition
                hover:bg-[#0069A7]
                focus:outline-none
                focus:ring-4
                focus:ring-[#0078BD]/15
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
    </main>
  );
};

export default EditProfile;