import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Gamepad2,
  MapPin,
  Trophy,
  UserRound,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { getGameById } from "../../services/gameService";
import { getPlayers } from "../../services/playerService";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [gameResponse, playersResponse] =
          await Promise.all([
            getGameById(id),
            getPlayers(),
          ]);

        if (gameResponse.success) {
          setGame(gameResponse.game);
        }

        if (playersResponse.success) {
          const allPlayers =
            playersResponse.players || [];

          const filteredPlayers =
            allPlayers.filter((player) =>
              player.preferredGames?.some(
                (game) => game._id === id
              )
            );

          setPlayers(filteredPlayers);
        }
      } catch (error) {
        console.error(
          "Game details error:",
          error
        );

        toast.error(
          "Unable to load game details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="
        flex min-h-[70vh]
        items-center justify-center
      ">
        <Loader2
          size={28}
          className="
            animate-spin
            text-[#0078BD]
          "
        />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="
        mx-auto max-w-5xl
        px-4 py-12
        text-center
      ">
        <h2 className="
          text-xl font-bold
          text-slate-900
        ">
          Game not found
        </h2>

        <button
          onClick={() => navigate("/games")}
          className="
            mt-4 text-sm
            font-medium
            text-[#0078BD]
          "
        >
          Back to games
        </button>
      </div>
    );
  }

  return (
    <div className="
      mx-auto max-w-6xl
      px-4 py-8
      sm:px-6 lg:px-8
    ">

      <button
        onClick={() => navigate("/games")}
        className="
          mb-6 flex items-center
          gap-2 text-sm
          font-medium
          text-slate-500
          hover:text-[#0078BD]
        "
      >
        <ArrowLeft size={17} />
        Back to games
      </button>

      {/* Game Header */}

      <div className="
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
      ">

        <div className="
          grid md:grid-cols-[300px_1fr]
        ">

          <div className="
            aspect-[4/3]
            bg-slate-100
            md:aspect-auto
          ">
            {game.image ? (
              <img
                src={game.image}
                alt={game.name}
                className="
                  h-full w-full
                  object-cover
                "
              />
            ) : (
              <div className="
                flex h-full
                min-h-60
                items-center
                justify-center
              ">
                <Gamepad2
                  size={60}
                  className="text-slate-300"
                />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">

            <span className="
              inline-flex
              rounded-full
              bg-[#0078BD]/10
              px-3 py-1
              text-xs font-semibold
              text-[#0078BD]
            ">
              {game.type}
            </span>

            <h1 className="
              mt-3 text-3xl
              font-bold
              text-slate-900
            ">
              {game.name}
            </h1>

            <p className="
              mt-3 max-w-2xl
              text-sm leading-6
              text-slate-500
            ">
              {game.description}
            </p>

            <div className="
              mt-6 flex
              items-center gap-2
              text-sm text-slate-500
            ">
              <Trophy
                size={17}
                className="text-[#0078BD]"
              />

              {players.length}{" "}
              {players.length === 1
                ? "player"
                : "players"}{" "}
              interested in this game
            </div>

          </div>
        </div>
      </div>

      {/* Players */}

      <div className="mt-8">

        <h2 className="
          text-xl font-bold
          text-slate-900
        ">
          Players
        </h2>

        <p className="
          mt-1 text-sm
          text-slate-500
        ">
          Players looking for partners in {game.name}.
        </p>

        {players.length > 0 ? (
          <div className="
            mt-5 grid gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          ">
            {players.map((player) => (
              <div
                key={player._id}
                className="
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <div className="
                  flex items-center gap-4
                ">

                  <div className="
                    flex h-12 w-12
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    bg-slate-100
                  ">
                    {player.image ? (
                      <img
                        src={player.image}
                        alt={player.name}
                        className="
                          h-full w-full
                          object-cover
                        "
                      />
                    ) : (
                      <UserRound
                        size={21}
                        className="text-slate-400"
                      />
                    )}
                  </div>

                  <div className="min-w-0">

                    <h3 className="
                      truncate
                      font-semibold
                      text-slate-900
                    ">
                      {player.name}
                    </h3>

                    <div className="
                      mt-1 flex
                      items-center gap-1
                      text-xs text-slate-400
                    ">
                      <MapPin size={13} />

                      {player.location ||
                        "Location not provided"}
                    </div>

                  </div>
                </div>

                <div className="
                  mt-4 flex
                  items-center
                  justify-between
                ">

                  <span className="
                    rounded-full
                    bg-slate-100
                    px-3 py-1
                    text-xs font-medium
                    text-slate-600
                  ">
                    {player.skillLevel ||
                      "Beginner"}
                  </span>

                  <button
                    onClick={() =>
                      navigate(
                        `/players/${player._id}`
                      )
                    }
                    className="
                      text-sm
                      font-semibold
                      text-[#0078BD]
                      hover:underline
                    "
                  >
                    View Profile
                  </button>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="
            mt-5 rounded-2xl
            border border-dashed
            border-slate-300
            bg-white
            p-12
            text-center
          ">
            <UserRound
              size={35}
              className="
                mx-auto
                text-slate-300
              "
            />

            <h3 className="
              mt-3 font-semibold
              text-slate-900
            ">
              No players yet
            </h3>

            <p className="
              mt-1 text-sm
              text-slate-500
            ">
              No players have selected this game yet.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default GameDetails;