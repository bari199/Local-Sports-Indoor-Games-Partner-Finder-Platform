import { useEffect, useMemo, useState } from "react";
import { Search, Users, SlidersHorizontal } from "lucide-react";

import PlayerCard from "../../components/players/PlayerCard";
import PlayerSkeleton from "../../components/players/PlayerSkeleton";
import { getPlayers } from "../../services/playerService";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [skillLevel, setSkillLevel] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            response.message || "Unable to load players"
          );
        }
      } catch (error) {
        console.error("Get players error:", error);

        setError(
          "Unable to load players. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        player.name?.toLowerCase().includes(searchValue) ||
        player.location?.toLowerCase().includes(searchValue) ||
        player.preferredGames?.some((game) =>
          game.name?.toLowerCase().includes(searchValue)
        );

      const matchesSkill =
        skillLevel === "all" ||
        player.skillLevel === skillLevel;

      return matchesSearch && matchesSkill;
    });
  }, [players, search, skillLevel]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Header */}

      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="
            flex h-11 w-11 items-center justify-center
            rounded-xl
            bg-[#0078BD]/10
            text-[#0078BD]
          ">
            <Users size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Find Players
            </h1>

            <p className="text-sm text-slate-500">
              Connect with players who enjoy the same games.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}

      <div className="
        mb-7 rounded-2xl
        border border-slate-200
        bg-white
        p-4
        shadow-sm
        sm:p-5
      ">
        <div className="grid gap-3 md:grid-cols-[1fr_200px]">

          {/* Search */}

          <div className="relative">
            <Search
              size={18}
              className="
                absolute left-3 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, location or game..."
              className="
                h-11 w-full rounded-lg
                border border-slate-200
                bg-slate-50
                pl-10 pr-4
                text-sm
                outline-none
                transition
                focus:border-[#0078BD]
                focus:bg-white
                focus:ring-2
                focus:ring-[#0078BD]/10
              "
            />
          </div>

          {/* Skill */}

          <div className="relative">
            <SlidersHorizontal
              size={17}
              className="
                pointer-events-none
                absolute left-3 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              value={skillLevel}
              onChange={(event) =>
                setSkillLevel(event.target.value)
              }
              className="
                h-11 w-full appearance-none
                rounded-lg
                border border-slate-200
                bg-slate-50
                pl-10 pr-4
                text-sm text-slate-700
                outline-none
                focus:border-[#0078BD]
                focus:ring-2
                focus:ring-[#0078BD]/10
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
        </div>
      </div>

      {/* Result count */}

      {!loading && !error && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {filteredPlayers.length}{" "}
            {filteredPlayers.length === 1
              ? "player"
              : "players"}{" "}
            found
          </p>
        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="
          grid gap-5
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        ">
          {Array.from({ length: 8 }).map((_, index) => (
            <PlayerSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="
          rounded-2xl
          border border-red-100
          bg-red-50
          p-8
          text-center
        ">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Players */}

      {!loading &&
        !error &&
        filteredPlayers.length > 0 && (
          <div className="
            grid gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          ">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player._id}
                player={player}
              />
            ))}
          </div>
        )}

      {/* Empty */}

      {!loading &&
        !error &&
        filteredPlayers.length === 0 && (
          <div className="
            rounded-2xl
            border border-dashed
            border-slate-300
            bg-white
            px-6 py-14
            text-center
          ">
            <div className="
              mx-auto flex h-14 w-14
              items-center justify-center
              rounded-full
              bg-slate-100
              text-slate-400
            ">
              <Users size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No players found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Try changing your search or skill-level filter
              to find more players.
            </p>
          </div>
        )}
    </div>
  );
};

export default Players;