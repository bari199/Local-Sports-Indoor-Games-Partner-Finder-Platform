import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Search,
  Users,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import PlayerCard from "../../components/players/PlayerCard";
import PlayerSkeleton from "../../components/players/PlayerSkeleton";

import { getPlayers } from "../../services/playerService";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [skillLevel, setSkillLevel] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH PLAYERS
  // ============================================================

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPlayers();

        if (response.success) {
          setPlayers(response.players || []);
        } else {
          setError(
            response.message ||
              "Unable to load players"
          );
        }
      } catch (error) {
        console.error(
          "Get players error:",
          error
        );

        setError(
          "Unable to load players. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        player.name
          ?.toLowerCase()
          .includes(searchValue) ||
        player.location
          ?.toLowerCase()
          .includes(searchValue) ||
        player.preferredGames?.some((game) =>
          game.name
            ?.toLowerCase()
            .includes(searchValue)
        );

      const matchesSkill =
        skillLevel === "all" ||
        player.skillLevel === skillLevel;

      return (
        matchesSearch &&
        matchesSkill
      );
    });
  }, [
    players,
    search,
    skillLevel,
  ]);

  const hasFilters =
    search.trim() !== "" ||
    skillLevel !== "all";

  const clearFilters = () => {
    setSearch("");
    setSkillLevel("all");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">

        {/* ====================================================
            HERO
        ==================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200/70
            bg-white
            px-6
            py-7
            shadow-sm
            sm:px-8
            sm:py-8
          "
        >

          {/* Background */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              h-64
              w-64
              rounded-full
              bg-[#0078BD]/8
              blur-3xl
            "
          />

          <div className="relative">

            <Badge
              variant="secondary"
              className="
                rounded-full
                bg-[#0078BD]/10
                px-3
                py-1
                text-[#0078BD]
              "
            >
              <Sparkles size={12} />

              Community
            </Badge>

            <h1
              className="
                mt-4
                text-3xl
                font-black
                tracking-tight
                text-slate-950
                sm:text-4xl
              "
            >
              Find your next
              <span className="text-[#0078BD]">
                {" "}game partner.
              </span>
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
                sm:text-base
              "
            >
              Discover local players who share
              your favorite games and skill level.
            </p>

            {/* Result */}

            {!loading && !error && (
              <div className="mt-5 flex items-center gap-2">

                <Users
                  size={15}
                  className="text-slate-400"
                />

                <span className="text-sm font-semibold text-slate-600">
                  {filteredPlayers.length}
                </span>

                <span className="text-sm text-slate-400">
                  {filteredPlayers.length === 1
                    ? "player available"
                    : "players available"}
                </span>
              </div>
            )}
          </div>
        </motion.section>

        {/* ====================================================
            FILTER BAR
        ==================================================== */}

        <section className="sticky top-[68px] z-30 -mx-1 mt-5 px-1">

          <div
            className="
              rounded-2xl
              border
              border-slate-200/70
              bg-white/95
              p-2
              shadow-sm
              backdrop-blur-xl
            "
          >

            <div className="flex flex-col gap-2 md:flex-row">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search players, locations or games..."
                  className="
                    h-11
                    border-0
                    bg-slate-50
                    pl-10
                    pr-10
                    text-sm
                    shadow-none
                    focus-visible:ring-1
                    focus-visible:ring-[#0078BD]/20
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      hover:text-slate-700
                    "
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Skill */}

              <div className="relative md:w-52">

                <SlidersHorizontal
                  size={16}
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <select
                  value={skillLevel}
                  onChange={(event) =>
                    setSkillLevel(
                      event.target.value
                    )
                  }
                  className="
                    h-11
                    w-full
                    appearance-none
                    rounded-lg
                    border-0
                    bg-slate-50
                    pl-10
                    pr-4
                    text-sm
                    font-medium
                    text-slate-600
                    outline-none
                    transition
                    focus:ring-1
                    focus:ring-[#0078BD]/20
                  "
                >
                  <option value="all">
                    All skill levels
                  </option>

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

              {/* Clear */}

              {hasFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="
                    h-11
                    rounded-lg
                    px-4
                    text-slate-500
                    hover:bg-slate-100
                  "
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <section className="mt-7">

          {/* Loading */}

          {loading && (
            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {Array.from({
                length: 8,
              }).map((_, index) => (
                <PlayerSkeleton
                  key={index}
                />
              ))}
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div
              className="
                rounded-2xl
                border
                border-red-100
                bg-red-50
                px-6
                py-12
                text-center
              "
            >
              <p className="text-sm font-semibold text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Players */}

          {!loading &&
            !error &&
            filteredPlayers.length > 0 && (
              <div
                className="
                  grid
                  gap-5
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                "
              >
                {filteredPlayers.map(
                  (player) => (
                    <PlayerCard
                      key={player._id}
                      player={player}
                    />
                  )
                )}
              </div>
            )}

          {/* Empty */}

          {!loading &&
            !error &&
            filteredPlayers.length === 0 && (
              <div
                className="
                  rounded-[28px]
                  border
                  border-dashed
                  border-slate-300
                  bg-white
                  px-6
                  py-16
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
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

                <h3 className="mt-5 text-base font-bold text-slate-900">
                  No players found
                </h3>

                <p
                  className="
                    mx-auto
                    mt-1.5
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Try another name, location,
                  game or skill level.
                </p>

                {hasFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
        </section>
      </div>
    </main>
  );
};

export default Players;