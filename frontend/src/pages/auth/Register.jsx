import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
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

  const gamesScrollRef = useRef(null);

  const scrollGames = (direction) => {
    const el = gamesScrollRef.current;

    if (!el) {
      return;
    }

    const cardWidth = 88; // card width (80px) + gap (~8px)
    const amount = cardWidth * 3;

    el.scrollBy({
      left:
        direction === "left"
          ? -amount
          : amount,
      behavior: "smooth",
    });
  };

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
        className="space-y-8"
      >
        {/* ==================================================
            PROFILE IMAGE
        ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
        >
          {/* IMAGE */}

          <div
            className="
              relative
              h-20
              w-20
              shrink-0
              overflow-hidden
              rounded-full
              bg-white
              ring-4
              ring-white
              shadow-sm
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
                  bg-slate-100
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
                shadow-md
                ring-2
                ring-white
                transition
                hover:scale-105
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

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">
              Add a profile photo
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              JPG, PNG or WEBP · Max 5MB
            </p>

            {image && (
              <p className="mt-1.5 inline-flex max-w-full items-center gap-1 truncate rounded-full bg-[#0078BD]/10 px-2 py-0.5 text-[11px] font-medium text-[#0078BD]">
                <Check size={11} className="shrink-0" />
                <span className="truncate">{image.name}</span>
              </p>
            )}
          </div>
        </motion.div>

        {/* ==================================================
            ACCOUNT DETAILS
        ================================================== */}

        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <UserRound size={13} />
            Account details
          </div>

          <AuthInput
            label="Full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Rahul Sharma"
          />

          <AuthInput
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative">
              <AuthInput
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Kolkata"
              />
              <MapPin
                size={15}
                className="pointer-events-none absolute right-3.5 top-[38px] text-slate-300"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="skillLevel"
                className="text-sm font-medium text-slate-700"
              >
                Skill level
              </label>

              <div className="relative">
                <select
                  id="skillLevel"
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleChange}
                  className="
                    h-11
                    w-full
                    appearance-none
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3.5
                    pr-9
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

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            SECURITY
        ================================================== */}

        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <ShieldCheck size={13} />
            Security
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />

            <AuthInput
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>
        </div>

        {/* ==================================================
            PREFERRED GAMES
        ================================================== */}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Sparkles size={13} />
                Preferred games
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Select the games you enjoy playing.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {formData.preferredGames.length > 0 && (
                <span className="rounded-full bg-[#0078BD]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0078BD]">
                  {formData.preferredGames.length} selected
                </span>
              )}
            </div>
          </div>

          {gamesLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-10 text-sm text-slate-400">
              <Loader2
                size={18}
                className="animate-spin text-[#0078BD]"
              />
              Loading games...
            </div>
          ) : games.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-500">
                No games available right now.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div
                ref={gamesScrollRef}
                className="
                  flex
                  snap-x
                  snap-mandatory
                  gap-2.5
                  overflow-x-auto
                  scroll-px-1
                  px-1
                  pb-2
                  [-ms-overflow-style:none]
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                "
              >
              {games.map((game, index) => {
                const selected =
                  formData.preferredGames.includes(
                    game._id
                  );

                return (
                  <motion.button
                    key={game._id}
                    type="button"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.04,
                    }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() =>
                      toggleGame(
                        game._id
                      )
                    }
                    className={`
                      group
                      relative
                      w-20
                      shrink-0
                      snap-start
                      overflow-hidden
                      rounded-lg
                      border
                      bg-white
                      text-left
                      shadow-sm
                      transition-all
                      duration-200
                      ${
                        selected
                          ? "border-[#0078BD] ring-2 ring-[#0078BD]/15"
                          : "border-slate-200 hover:border-[#0078BD]/50 hover:shadow-md"
                      }
                    `}
                  >
                    <div className="aspect-square overflow-hidden bg-slate-100">
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

                      <div
                        className={`
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/20
                          to-transparent
                          transition-opacity
                          ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                        `}
                      />
                    </div>

                    <div className="px-1.5 py-1.5">
                      <p className="truncate text-[11px] font-semibold leading-tight text-slate-800">
                        {game.name}
                      </p>

                      <p className="mt-0.5 truncate text-[9px] leading-tight text-slate-400">
                        {game.type}
                      </p>
                    </div>

                    {selected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0078BD] text-white shadow-md"
                      >
                        <Check size={10} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
              </div>

              <button
                type="button"
                onClick={() => scrollGames("left")}
                className="
                  absolute
                  -left-1
                  top-1/2
                  z-10
                  flex
                  h-7
                  w-7
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  text-slate-500
                  shadow-md
                  transition
                  hover:border-[#0078BD]/50
                  hover:text-[#0078BD]
                  active:scale-95
                "
                aria-label="Scroll games left"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                type="button"
                onClick={() => scrollGames("right")}
                className="
                  absolute
                  -right-1
                  top-1/2
                  z-10
                  flex
                  h-7
                  w-7
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  text-slate-500
                  shadow-md
                  transition
                  hover:border-[#0078BD]/50
                  hover:text-[#0078BD]
                  active:scale-95
                "
                aria-label="Scroll games right"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ==================================================
            SUBMIT
        ================================================== */}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
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
        </motion.button>

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