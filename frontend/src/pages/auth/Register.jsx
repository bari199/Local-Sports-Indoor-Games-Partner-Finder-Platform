import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Camera,
  Check,
  Loader2,
  UserPlus,
  UserRound,
} from "lucide-react";

import { toast } from "sonner";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";

import { registerUser } from "../../services/authService";
import { getGames } from "../../services/gameService";

const Register = () => {
  const navigate = useNavigate();

  // ==================================================
  // STATE
  // ==================================================

  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    skillLevel: "Beginner",
    preferredGames: [],
  });

  // ==================================================
  // FETCH GAMES
  // ==================================================

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setGamesLoading(true);

        const response = await getGames();

        if (response.success) {
          setGames(response.games || []);
        } else {
          toast.error(
            response.message ||
              "Unable to load games"
          );
        }
      } catch (error) {
        console.error(
          "Fetch games error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Unable to load games"
        );
      } finally {
        setGamesLoading(false);
      }
    };

    fetchGames();
  }, []);

  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // IMAGE CHANGE
  // ==================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // IMAGE TYPE
    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select an image file"
      );

      e.target.value = "";
      return;
    }

    // IMAGE SIZE
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image must be less than 5MB"
      );

      e.target.value = "";
      return;
    }

    // CLEAN OLD PREVIEW
    if (
      preview &&
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    // STORE IMAGE
    setImage(file);

    // CREATE PREVIEW
    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);
  };

  // ==================================================
  // CLEAN IMAGE PREVIEW
  // ==================================================

  useEffect(() => {
    return () => {
      if (
        preview &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ==================================================
  // GAME SELECTION
  // ==================================================

  const toggleGame = (gameId) => {
    setFormData((prev) => {
      const alreadySelected =
        prev.preferredGames.includes(
          gameId
        );

      return {
        ...prev,

        preferredGames:
          alreadySelected
            ? prev.preferredGames.filter(
                (id) => id !== gameId
              )
            : [
                ...prev.preferredGames,
                gameId,
              ],
      };
    });
  };

  // ==================================================
  // FORM SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "REGISTER FORM DATA:",
      formData
    );

    // PASSWORD
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );

      return;
    }

    // PREFERRED GAMES
    if (
      formData.preferredGames.length === 0
    ) {
      toast.error(
        "Please select at least one preferred game"
      );

      return;
    }

    try {
      setLoading(true);

      // ==================================================
      // CREATE FORMDATA
      // ==================================================

      const payload = new FormData();

      payload.append(
        "name",
        formData.name.trim()
      );

      payload.append(
        "email",
        formData.email.trim()
      );

      payload.append(
        "password",
        formData.password
      );

      payload.append(
        "location",
        formData.location.trim()
      );

      payload.append(
        "skillLevel",
        formData.skillLevel
      );

      payload.append(
        "preferredGames",
        JSON.stringify(
          formData.preferredGames
        )
      );

      // ==================================================
      // PROFILE IMAGE
      // ==================================================

      if (image instanceof File) {
        payload.append(
          "image",
          image
        );
      }

      // ==================================================
      // DEBUG
      // ==================================================

      console.log(
        "========== REGISTER REQUEST =========="
      );

      for (
        const [key, value] of
        payload.entries()
      ) {
        if (value instanceof File) {
          console.log(key, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(
            key,
            value
          );
        }
      }

      // ==================================================
      // API REQUEST
      // ==================================================

      const response =
        await registerUser(payload);

      // ==================================================
      // RESPONSE
      // ==================================================

      if (!response.success) {
        toast.error(
          response.message ||
            "Registration failed"
        );

        return;
      }

      toast.success(
        "Account created successfully"
      );

      navigate("/login");
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

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
          "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* ==================================================
            PROFILE IMAGE
        ================================================== */}

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">
            Profile photo
          </label>

          <div className="flex items-center gap-4">
            {/* IMAGE */}

            <div
              className="
                relative
                h-20
                w-20
                shrink-0
                overflow-hidden
                rounded-full
                bg-slate-100
              "
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
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
                  <UserRound
                    size={32}
                    className="text-slate-300"
                  />
                </div>
              )}

              {/* CAMERA BUTTON */}

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
                  transition
                  hover:bg-[#0069A7]
                "
              >
                <Camera size={14} />

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={
                    handleImageChange
                  }
                  disabled={loading}
                />
              </label>
            </div>

            {/* DESCRIPTION */}

            <div>
              <p className="text-sm font-medium text-slate-700">
                Add a profile photo
              </p>

              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG or WEBP · Max 5MB
              </p>

              {image && (
                <p className="mt-1 text-xs font-medium text-[#0078BD]">
                  {image.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================
            NAME
        ================================================== */}

        <AuthInput
          label="Full name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Rahul Sharma"
        />

        {/* ==================================================
            EMAIL
        ================================================== */}

        <AuthInput
          label="Email address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        {/* ==================================================
            LOCATION
        ================================================== */}

        <AuthInput
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Kolkata"
        />

        {/* ==================================================
            SKILL LEVEL
        ================================================== */}

        <div className="space-y-2">
          <label
            htmlFor="skillLevel"
            className="text-sm font-medium text-slate-700"
          >
            Skill level
          </label>

          <select
            id="skillLevel"
            name="skillLevel"
            value={formData.skillLevel}
            onChange={handleChange}
            className="
              h-11
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3.5
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-[#0078BD]
              focus:ring-4
              focus:ring-[#0078BD]/10
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

        {/* ==================================================
            PASSWORD
        ================================================== */}

        <AuthInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
        />

        {/* ==================================================
            CONFIRM PASSWORD
        ================================================== */}

        <AuthInput
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />

        {/* ==================================================
            PREFERRED GAMES
        ================================================== */}

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Preferred games
            </label>

            <p className="mt-1 text-xs text-slate-400">
              Select the games you enjoy playing.
            </p>
          </div>

          {gamesLoading ? (
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-8">
              <Loader2
                size={20}
                className="animate-spin text-[#0078BD]"
              />
            </div>
          ) : games.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">
                No games available right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {games.map((game) => {
                const selected =
                  formData.preferredGames.includes(
                    game._id
                  );

                return (
                  <button
                    key={game._id}
                    type="button"
                    onClick={() =>
                      toggleGame(
                        game._id
                      )
                    }
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      text-left
                      transition-all
                      duration-200
                      ${
                        selected
                          ? "border-[#0078BD] ring-2 ring-[#0078BD]/15"
                          : "border-slate-200 hover:border-[#0078BD]/50"
                      }
                    `}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-300
                          group-hover:scale-105
                        "
                      />
                    </div>

                    <div className="p-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {game.name}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {game.type}
                      </p>
                    </div>

                    {selected && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0078BD] text-white shadow-md">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {formData.preferredGames.length >
            0 && (
            <p className="text-xs font-medium text-[#0078BD]">
              {formData.preferredGames.length}{" "}
              game
              {formData.preferredGames.length >
              1
                ? "s"
                : ""}{" "}
              selected
            </p>
          )}
        </div>

        {/* ==================================================
            SUBMIT
        ================================================== */}

        <button
          type="submit"
          disabled={
            loading ||
            gamesLoading
          }
          className="
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[#0078BD]
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#0069A7]
            focus:outline-none
            focus:ring-4
            focus:ring-[#0078BD]/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />

              Creating account...
            </>
          ) : (
            <>
              <UserPlus size={17} />

              Create account
            </>
          )}
        </button>

        {/* ==================================================
            LOGIN LINK
        ================================================== */}

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#0078BD] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;