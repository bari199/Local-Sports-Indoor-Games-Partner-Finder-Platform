import { useEffect, useMemo, useState } from "react";
import { Gamepad2, Search } from "lucide-react";
import { toast } from "sonner";

import { getGames } from "../../services/gameService";
import GameCard from "../../components/games/GameCard";

const Games = () => {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);

        const response = await getGames();

        if (response.success) {
          setGames(response.games || []);
        } else {
          toast.error(
            response.message || "Unable to load games"
          );
        }
      } catch (error) {
        console.error("Get games error:", error);

        toast.error("Unable to load games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return games;
    }

    return games.filter(
      (game) =>
        game.name?.toLowerCase().includes(value) ||
        game.type?.toLowerCase().includes(value) ||
        game.description?.toLowerCase().includes(value)
    );
  }, [games, search]);

  return (
    <div className="
      mx-auto max-w-7xl
      px-4 py-8
      sm:px-6 lg:px-8
    ">

      {/* Header */}

      <div className="mb-8">
        <div className="flex items-center gap-3">

          <div className="
            flex h-11 w-11
            items-center justify-center
            rounded-xl
            bg-[#0078BD]/10
            text-[#0078BD]
          ">
            <Gamepad2 size={22} />
          </div>

          <div>
            <h1 className="
              text-2xl font-bold
              text-slate-900
            ">
              Explore Games
            </h1>

            <p className="
              mt-1 text-sm
              text-slate-500
            ">
              Find players based on the games you enjoy.
            </p>
          </div>

        </div>
      </div>

      {/* Search */}

      <div className="
        mb-8 max-w-xl
        relative
      ">
        <Search
          size={18}
          className="
            absolute left-3
            top-1/2
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
          placeholder="Search games..."
          className="
            h-11 w-full
            rounded-xl
            border border-slate-200
            bg-white
            pl-10 pr-4
            text-sm
            outline-none
            transition
            focus:border-[#0078BD]
            focus:ring-2
            focus:ring-[#0078BD]/10
          "
        />
      </div>

      {loading && (
        <div className="
          grid gap-5
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        ">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
              "
            >
              <div className="
                aspect-[16/10]
                animate-pulse
                bg-slate-200"
              />

              <div className="space-y-3 p-5">
                <div className="
                  h-4 w-24
                  animate-pulse
                  rounded
                  bg-slate-200"
                />

                <div className="
                  h-6 w-32
                  animate-pulse
                  rounded
                  bg-slate-200"
                />

                <div className="
                  h-10 w-full
                  animate-pulse
                  rounded-lg
                  bg-slate-200"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Games */}

      {!loading && filteredGames.length > 0 && (
        <>
          <p className="
            mb-4 text-sm
            text-slate-500
          ">
            {filteredGames.length}{" "}
            {filteredGames.length === 1
              ? "game"
              : "games"}{" "}
            available
          </p>

          <div className="
            grid gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          ">
            {filteredGames.map((game) => (
              <GameCard
                key={game._id}
                game={game}
              />
            ))}
          </div>
        </>
      )}

      {/* Empty */}

      {!loading && filteredGames.length === 0 && (
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
            <Gamepad2 size={25} />
          </div>

          <h3 className="
            mt-4 font-semibold
            text-slate-900
          ">
            No games found
          </h3>

          <p className="
            mt-1 text-sm
            text-slate-500
          ">
            Try searching for another game.
          </p>
        </div>
      )}

    </div>
  );
};

export default Games;