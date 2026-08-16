import {
  MapPin,
  Trophy,
  Users,
  Gamepad2,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Target,
  Zap,
} from "lucide-react";

import GiftBanner from "@/components/common/GiftBanner";
import useAuth from "../../hooks/useAuth";
import Footer from "@/components/common/Footer";

// ============================================================
// SKILL STYLES
// ============================================================

// Presentational-only helper.
// Existing skillLevel values and business logic remain unchanged.

const SKILL_STYLES = {
  Beginner: {
    ring: "from-slate-400 to-slate-500",
    chip: "bg-slate-100 text-slate-600",
    glow: "bg-slate-500/10",
  },

  Intermediate: {
    ring: "from-[#FFB800] to-[#FF8A00]",
    chip: "bg-amber-50 text-amber-600",
    glow: "bg-amber-500/10",
  },

  Advanced: {
    ring: "from-[#0078BD] to-[#003F88]",
    chip: "bg-[#0078BD]/10 text-[#0078BD]",
    glow: "bg-[#0078BD]/10",
  },

  Pro: {
    ring: "from-[#0078BD] to-[#003F88]",
    chip: "bg-[#0078BD]/10 text-[#0078BD]",
    glow: "bg-[#0078BD]/10",
  },
};

// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {
  const { user } = useAuth();

  console.log("DASHBOARD USER:", user);
  console.log("PREFERRED GAMES:", user?.preferredGames);

  const skillLevel = user?.skillLevel || "Beginner";

  const skillStyle =
    SKILL_STYLES[skillLevel] ||
    SKILL_STYLES.Beginner;

  return (
    <main className="min-h-screen bg-[#F7F9FC]">

      {/* ======================================================
          GIFT BANNER
      ====================================================== */}

      <GiftBanner />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* ====================================================
            TOP IDENTITY / WELCOME
        ==================================================== */}

        <section
          className="
            relative overflow-hidden
            rounded-[28px]
            border border-slate-200
            bg-white
            shadow-[0_12px_40px_rgba(15,23,42,0.06)]
          "
        >

          {/* Decorative background */}

          <div className="absolute inset-0 overflow-hidden">

            <div
              className="
                absolute -right-24 -top-32
                h-80 w-80
                rounded-full
                bg-[#0078BD]/10
                blur-3xl
              "
            />

            <div
              className="
                absolute -bottom-32 left-1/3
                h-72 w-72
                rounded-full
                bg-[#FFB800]/10
                blur-3xl
              "
            />

          </div>

          <div className="relative grid lg:grid-cols-[1fr_auto]">

            {/* ==================================================
                MAIN WELCOME CONTENT
            ================================================== */}

            <div className="p-6 sm:p-8 lg:p-10">

              <div className="flex items-start gap-4">

                {/* Avatar */}

                <div
                  className="
                    hidden h-16 w-16
                    shrink-0
                    items-center justify-center
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-br
                    from-[#0078BD]
                    to-[#003F88]
                    text-xl font-bold
                    text-white
                    shadow-lg
                    shadow-[#0078BD]/20
                    sm:flex
                  "
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.name || "Player"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "P"
                  )}
                </div>

                <div>

                  <div
                    className="
                      flex items-center gap-2
                      text-xs font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#0078BD]
                    "
                  >
                    <Sparkles size={14} />

                    Player Dashboard
                  </div>

                  <h1
                    className="
                      mt-2
                      text-3xl
                      font-black
                      tracking-tight
                      text-slate-950
                      sm:text-4xl
                    "
                  >
                    Hey, {user?.name || "Player"}
                  </h1>

                  <p
                    className="
                      mt-2
                      max-w-xl
                      text-sm
                      leading-6
                      text-slate-500
                      sm:text-base
                    "
                  >
                    Your sports hub is ready. Discover players,
                    explore your games, and find your next partner.
                  </p>

                </div>
              </div>

              {/* Identity chips */}

              <div className="mt-7 flex flex-wrap gap-2.5">

                {user?.location && (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border border-slate-200
                      bg-slate-50
                      px-3.5 py-2
                      text-sm font-medium
                      text-slate-600
                    "
                  >
                    <MapPin
                      size={15}
                      className="text-[#0078BD]"
                    />

                    {user.location}
                  </div>
                )}

                <div
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    ${skillStyle.ring}
                    px-3.5 py-2
                    text-sm font-semibold
                    text-white
                    shadow-sm
                  `}
                >
                  <Trophy size={15} />

                  {skillLevel}
                </div>

              </div>
            </div>

            {/* ==================================================
                RIGHT VISUAL IDENTITY
            ================================================== */}

            <div
              className="
                relative hidden
                min-h-[230px]
                w-[300px]
                items-center
                justify-center
                overflow-hidden
                bg-gradient-to-br
                from-[#0078BD]
                to-[#003F88]
                lg:flex
              "
            >

              <div
                className="
                  absolute
                  h-48 w-48
                  rounded-full
                  border border-white/10
                "
              />

              <div
                className="
                  absolute
                  h-64 w-64
                  rounded-full
                  border border-white/10
                "
              />

              <Trophy
                size={130}
                strokeWidth={1}
                className="relative text-white/90"
              />

              <div
                className="
                  absolute
                  bottom-5 left-5
                  rounded-xl
                  border border-white/10
                  bg-white/10
                  px-3 py-2
                  backdrop-blur-md
                "
              >
                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-wider
                    text-white/60
                  "
                >
                  Your level
                </p>

                <p className="mt-0.5 text-sm font-bold text-white">
                  {skillLevel}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ====================================================
            STATS / QUICK OVERVIEW
        ==================================================== */}

        <section className="mt-5 grid gap-4 sm:grid-cols-3">

          {/* ==================================================
              PREFERRED GAMES
          ================================================== */}

          <div
            className="
              group relative overflow-hidden
              rounded-2xl
              border border-white/10
              bg-gradient-to-br
              from-[#0078BD]
              via-[#0069A7]
              to-[#003F88]
              p-5
              text-white
              shadow-lg
              shadow-[#0078BD]/15
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              hover:shadow-[#0078BD]/25
            "
          >

            {/* Decorative glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-10 -top-10
                h-28 w-28
                rounded-full
                bg-white/10
                blur-2xl
              "
            />

            <div className="relative flex items-center justify-between">

              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  bg-white/15
                  text-white
                  backdrop-blur-sm
                "
              >
                <Gamepad2 size={20} />
              </div>

              <div
                className="
                  rounded-lg
                  bg-white/10
                  p-1.5
                  text-white/70
                  transition
                  group-hover:bg-white/20
                  group-hover:text-white
                "
              >
                <ChevronRight size={16} />
              </div>

            </div>

            <div className="relative mt-5">

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-white/60
                "
              >
                Preferred games
              </p>

              <div className="mt-1 flex items-end gap-2">

                <span
                  className="
                    text-3xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  {user?.preferredGames?.length || 0}
                </span>

                <span className="mb-1 text-sm text-white/60">
                  selected
                </span>

              </div>
            </div>
          </div>

          {/* ==================================================
              SKILL LEVEL
          ================================================== */}

          <div
            className="
              group relative overflow-hidden
              rounded-2xl
              border border-white/10
              bg-gradient-to-br
              from-[#0069A7]
              via-[#00558F]
              to-[#003F88]
              p-5
              text-white
              shadow-lg
              shadow-[#003F88]/15
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              hover:shadow-[#003F88]/25
            "
          >

            {/* Decorative glow */}

            <div
              className="
                pointer-events-none
                absolute
                -bottom-12 -right-8
                h-32 w-32
                rounded-full
                bg-cyan-300/10
                blur-2xl
              "
            />

            <div className="relative flex items-center justify-between">

              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  bg-white/15
                  text-white
                  backdrop-blur-sm
                "
              >
                <Trophy size={20} />
              </div>

              <Target
                size={18}
                className="
                  text-white/40
                  transition-colors
                  group-hover:text-white/70
                "
              />

            </div>

            <div className="relative mt-5">

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-white/60
                "
              >
                Skill level
              </p>

              <div
                className="
                  mt-1
                  text-2xl
                  font-black
                  tracking-tight
                  text-white
                "
              >
                {skillLevel}
              </div>

            </div>
          </div>

          {/* ==================================================
              PLAYER DISCOVERY
          ================================================== */}

          <div
            className="
              group relative overflow-hidden
              rounded-2xl
              border border-white/10
              bg-gradient-to-br
              from-[#0078BD]
              via-[#005EA8]
              to-[#003F88]
              p-5
              text-white
              shadow-lg
              shadow-[#0078BD]/15
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              hover:shadow-[#0078BD]/25
            "
          >

            {/* Decorative glow */}

            <div
              className="
                pointer-events-none
                absolute
                -bottom-12 -left-12
                h-32 w-32
                rounded-full
                bg-white/10
                blur-2xl
              "
            />

            <div className="relative flex items-center justify-between">

              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  bg-white/15
                  text-white
                  backdrop-blur-sm
                "
              >
                <Users size={20} />
              </div>

              <ArrowUpRight
                size={18}
                className="
                  text-white/40
                  transition-all
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                  group-hover:text-white
                "
              />

            </div>

            <div className="relative mt-5">

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-white/60
                "
              >
                Player discovery
              </p>

              <div className="mt-1 flex items-center gap-2">

                <span
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  Nearby
                </span>

                <span
                  className="
                    h-2 w-2
                    rounded-full
                    bg-emerald-300
                    shadow-sm
                    shadow-emerald-300/50
                  "
                />

              </div>

            </div>
          </div>

        </section>

        {/* ====================================================
            GAME SECTION
        ==================================================== */}

        <section className="mt-8">

          {/* Section heading */}

          <div
            className="
              mb-5
              flex flex-col gap-3
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >

            <div>

              <div className="flex items-center gap-2">

                <div className="h-7 w-1 rounded-full bg-[#0078BD]" />

                <h2
                  className="
                    text-xl
                    font-black
                    tracking-tight
                    text-slate-950
                  "
                >
                  Your games
                </h2>

              </div>

              <p className="mt-1.5 text-sm text-slate-500">
                Your selected sports for finding playing partners.
              </p>

            </div>

            {user?.preferredGames?.length > 0 && (
              <div
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-1.5
                  rounded-full
                  bg-slate-100
                  px-3 py-1.5
                  text-xs
                  font-semibold
                  text-slate-500
                "
              >
                <Zap size={13} />

                {user.preferredGames.length}{" "}

                {user.preferredGames.length === 1
                  ? "game"
                  : "games"}
              </div>
            )}

          </div>

          {/* ==================================================
              GAMES
          ================================================== */}

          {user?.preferredGames?.length > 0 ? (

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {user.preferredGames.map((game) => (

                <article
                  key={game._id}
                  className="
                    group relative overflow-hidden
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-slate-300
                    hover:shadow-xl
                    hover:shadow-slate-200/70
                  "
                >

                  {/* Image */}

                  <div
                    className="
                      relative
                      aspect-[4/3]
                      overflow-hidden
                      bg-slate-100
                    "
                  >

                    <img
                      src={game.image}
                      alt={game.name}
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />

                    {/* Image overlay */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/70
                        via-black/10
                        to-transparent
                      "
                    />

                    {/* Type */}

                    {game.type && (
                      <span
                        className="
                          absolute
                          left-3 top-3
                          rounded-lg
                          border border-white/20
                          bg-black/30
                          px-2.5 py-1
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-white
                          backdrop-blur-md
                        "
                      >
                        {game.type}
                      </span>
                    )}

                    {/* Bottom game name */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-3
                        "
                      >

                        <h3 className="text-lg font-bold text-white">
                          {game.name}
                        </h3>

                        <div
                          className="
                            flex h-8 w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-white/15
                            text-white
                            backdrop-blur-md
                            transition-colors
                            group-hover:bg-white
                            group-hover:text-[#0078BD]
                          "
                        >
                          <ArrowUpRight size={15} />
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Card footer */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      px-4 py-3.5
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-medium
                        text-slate-500
                      "
                    >
                      <Users size={14} />

                      Find partners
                    </div>

                    <ChevronRight
                      size={15}
                      className="
                        text-slate-300
                        transition-transform
                        group-hover:translate-x-0.5
                        group-hover:text-[#0078BD]
                      "
                    />

                  </div>

                </article>
              ))}

            </div>

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border border-dashed
                border-slate-300
                bg-white
                p-10
                text-center
              "
            >

              <div
                className="
                  absolute
                  -right-16
                  -top-16
                  h-40
                  w-40
                  rounded-full
                  bg-[#0078BD]/5
                  blur-2xl
                "
              />

              <div
                className="
                  relative
                  mx-auto
                  flex h-16 w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#0078BD]/10
                  text-[#0078BD]
                "
              >
                <Gamepad2 size={28} />
              </div>

              <h3
                className="
                  relative
                  mt-5
                  text-base
                  font-bold
                  text-slate-900
                "
              >
                No preferred games yet
              </h3>

              <p
                className="
                  relative
                  mx-auto
                  mt-1.5
                  max-w-md
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Pick your favorite games to personalize your
                player discovery experience.
              </p>

            </div>
          )}

        </section>

        {/* ====================================================
            DISCOVERY CTA
        ==================================================== */}

        <section
          className="
            mt-8
            overflow-hidden
            rounded-2xl
            bg-gradient-to-r
            from-[#003F88]
            to-[#0078BD]
            p-6
            text-white
            shadow-lg
            shadow-[#0078BD]/10
            sm:p-7
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-white/60
                "
              >
                <Users size={14} />

                Community
              </div>

              <h2
                className="
                  mt-2
                  text-xl
                  font-black
                  tracking-tight
                  sm:text-2xl
                "
              >
                Ready to find your next game partner?
              </h2>

              <p
                className="
                  mt-1.5
                  max-w-xl
                  text-sm
                  leading-6
                  text-white/70
                "
              >
                Discover players who match your games,
                skill level, and location.
              </p>

            </div>

            <div
              className="
                flex
                h-11
                shrink-0
                items-center
                gap-2
                rounded-xl
                bg-white
                px-5
                text-sm
                font-bold
                text-[#003F88]
                shadow-sm
              "
            >
              Explore players

              <ArrowUpRight size={16} />
            </div>

          </div>
        </section>

      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </main>
  );
};

export default Dashboard;