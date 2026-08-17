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

        if (response?.success) {
          setGames(response.games || []);
        } else {
          toast.error(
            response?.message || "Unable to load games"
          );
        }
      } catch (error) {
        console.error("Fetch games error:", error);

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
      toast.error("Please select a valid image file");
      e.target.value = "";
      return;
    }

    // IMAGE SIZE
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      e.target.value = "";
      return;
    }

    // CLEAN OLD PREVIEW
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const objectUrl = URL.createObjectURL(file);

    setImage(file);
    setPreview(objectUrl);
  };

  // ==================================================
  // CLEAN IMAGE PREVIEW
  // ==================================================

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ==================================================
  // GAME SCROLL
  // ==================================================

  const scrollGames = (direction) => {
    const element = gamesScrollRef.current;

    if (!element) {
      return;
    }

    element.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  // ==================================================
  // GAME SELECTION
  // ==================================================

  const toggleGame = (gameId) => {
    setFormData((prev) => {
      const alreadySelected =
        prev.preferredGames.includes(gameId);

      return {
        ...prev,
        preferredGames: alreadySelected
          ? prev.preferredGames.filter(
              (id) => id !== gameId
            )
          : [...prev.preferredGames, gameId],
      };
    });
  };

  // ==================================================
  // FORM SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.preferredGames.length === 0) {
      toast.error(
        "Please select at least one preferred game"
      );
      return;
    }

    // --------------------------------------------------
    // SUBMIT
    // --------------------------------------------------

    try {
      setLoading(true);

      const payload = new FormData();

      payload.append(
        "name",
        formData.name.trim()
      );

      payload.append(
        "email",
        formData.email.trim().toLowerCase()
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
        JSON.stringify(formData.preferredGames)
      );

      // --------------------------------------------------
      // PROFILE IMAGE
      // --------------------------------------------------

      if (image instanceof File) {
        payload.append("image", image);
      }

      // --------------------------------------------------
      // API
      // --------------------------------------------------

      const response = await registerUser(payload);

      if (!response?.success) {
        toast.error(
          response?.message || "Registration failed"
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
        className="
          w-full
          space-y-6
          overflow-visible
        "
      >
        {/* ==================================================
            PROFILE IMAGE
        ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="
            flex
            items-center
            gap-4
            rounded-2xl
            border
            border-slate-100
            bg-slate-50/70
            p-3.5
          "
        >
          {/* PROFILE IMAGE */}

          <div
            className="
              relative
              h-[72px]
              w-[72px]
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
                  size={29}
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
                h-6.5
                w-6.5
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
                hover:bg-[#0069A7]
                hover:scale-105
              "
            >
              <Camera size={13} />

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
                disabled={loading}
              />
            </label>
          </div>

          {/* TEXT */}

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">
              Profile photo
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              JPG, PNG or WEBP · Max 5MB
            </p>

            {image && (
              <div
                className="
                  mt-1.5
                  inline-flex
                  max-w-full
                  items-center
                  gap-1
                  rounded-full
                  bg-[#0078BD]/10
                  px-2
                  py-0.5
                  text-[10px]
                  font-medium
                  text-[#0078BD]
                "
              >
                <Check size={10} />

                <span className="max-w-[180px] truncate">
                  {image.name}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ==================================================
            ACCOUNT DETAILS
        ================================================== */}

        <section className="space-y-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
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

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {/* LOCATION */}

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
                className="
                  pointer-events-none
                  absolute
                  right-3.5
                  top-[38px]
                  text-slate-300
                "
              />
            </div>

            {/* SKILL LEVEL */}

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
                  disabled={loading}
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
                    right-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECURITY
        ================================================== */}

        <section className="space-y-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
            <ShieldCheck size={13} />
            Security
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
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
              placeholder="Confirm password"
            />
          </div>
        </section>

        {/* ==================================================
            PREFERRED GAMES
        ================================================== */}

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                <Sparkles size={13} />
                Preferred games
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Choose the games you play.
              </p>
            </div>

            {formData.preferredGames.length > 0 && (
              <span
                className="
                  shrink-0
                  rounded-full
                  bg-[#0078BD]/10
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  text-[#0078BD]
                "
              >
                {formData.preferredGames.length} selected
              </span>
            )}
          </div>

          {/* GAMES */}

          {gamesLoading ? (
            <div
              className="
                flex
                h-[108px]
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                text-xs
                text-slate-400
              "
            >
              <Loader2
                size={17}
                className="animate-spin text-[#0078BD]"
              />

              Loading games...
            </div>
          ) : games.length === 0 ? (
            <div
              className="
                rounded-xl
                border
                border-dashed
                border-slate-300
                bg-slate-50
                p-5
                text-center
              "
            >
              <p className="text-xs text-slate-500">
                No games available right now.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* LEFT BUTTON */}

              <button
                type="button"
                onClick={() =>
                  scrollGames("left")
                }
                className="
                  absolute
                  -left-2
                  top-1/2
                  z-20
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
                aria-label="Previous games"
              >
                <ChevronLeft size={14} />
              </button>

              {/* GAME LIST */}

              <div
                ref={gamesScrollRef}
                className="
                  flex
                  gap-2.5
                  overflow-x-auto
                  px-1
                  py-1
                  scroll-smooth
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
                      initial={{
                        opacity: 0,
                        x: 8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.03,
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                      onClick={() =>
                        toggleGame(game._id)
                      }
                      className={`
                        group
                        relative
                        w-[76px]
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border
                        bg-white
                        text-left
                        shadow-sm
                        transition-all
                        duration-200
                        ${
                          selected
                            ? "border-[#0078BD] ring-2 ring-[#0078BD]/15"
                            : "border-slate-200 hover:border-[#0078BD]/40 hover:shadow-md"
                        }
                      `}
                    >
                      {/* IMAGE */}

                      <div
                        className="
                          aspect-square
                          overflow-hidden
                          bg-slate-100
                        "
                      >
                        {game.image ? (
                          <img
                            src={game.image}
                            alt={game.name}
                            loading="lazy"
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-300
                              group-hover:scale-105
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
                              text-[10px]
                              text-slate-300
                            "
                          >
                            No image
                          </div>
                        )}
                      </div>

                      {/* GAME INFO */}

                      <div className="px-1.5 py-1.5">
                        <p
                          className="
                            truncate
                            text-[10px]
                            font-semibold
                            leading-tight
                            text-slate-800
                          "
                        >
                          {game.name}
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[8px]
                            leading-tight
                            text-slate-400
                          "
                        >
                          {game.type}
                        </p>
                      </div>

                      {/* SELECTED */}

                      {selected && (
                        <motion.div
                          initial={{
                            scale: 0,
                            opacity: 0,
                          }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                          }}
                          className="
                            absolute
                            right-1
                            top-1
                            flex
                            h-4
                            w-4
                            items-center
                            justify-center
                            rounded-full
                            bg-[#0078BD]
                            text-white
                            shadow
                          "
                        >
                          <Check size={9} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* RIGHT BUTTON */}

              <button
                type="button"
                onClick={() =>
                  scrollGames("right")
                }
                className="
                  absolute
                  -right-2
                  top-1/2
                  z-20
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
                aria-label="Next games"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </section>

        {/* ==================================================
            SUBMIT
        ================================================== */}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          disabled={loading || gamesLoading}
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
            LOGIN
        ================================================== */}

        <p className="pb-1 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              font-semibold
              text-[#0078BD]
              transition
              hover:text-[#0069A7]
              hover:underline
            "
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;