import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Trophy,
  Gamepad2,
  UserRound,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { getPlayerById } from "../../services/playerService";
import { sendPartnerRequest } from "../../services/partnerRequestService";
import useAuth from "../../hooks/useAuth";

const PlayerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestingGame, setRequestingGame] = useState(null);

  const fetchPlayer = async () => {
    try {
      setLoading(true);

      const response = await getPlayerById(id);

      if (response.success) {
        setPlayer(response.player);
      } else {
        toast.error(
          response.message || "Player not found"
        );
      }
    } catch (error) {
      console.error("Get player error:", error);

      toast.error("Unable to load player profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayer();
  }, [id]);

  const handleSendRequest = async (game) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setRequestingGame(game._id);

      const response = await sendPartnerRequest({
        receiverId: player._id,
        gameId: game._id,
      });

      if (response.success) {
        toast.success(
          "Partner request sent successfully"
        );
      } else {
        toast.error(
          response.message || "Unable to send request"
        );
      }
    } catch (error) {
      console.error(
        "Send partner request error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to send partner request"
      );
    } finally {
      setRequestingGame(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={28}
            className="animate-spin text-[#0078BD]"
          />

          <p className="text-sm text-slate-500">
            Loading player profile...
          </p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-900">
          Player not found
        </h2>

        <button
          onClick={() => navigate("/players")}
          className="mt-4 text-sm font-medium text-[#0078BD]"
        >
          Back to players
        </button>
      </div>
    );
  }

  const games = player.preferredGames || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Back */}

      <button
        onClick={() => navigate("/players")}
        className="
          mb-6 flex items-center gap-2
          text-sm font-medium
          text-slate-500
          transition
          hover:text-[#0078BD]
        "
      >
        <ArrowLeft size={17} />
        Back to players
      </button>

      {/* Profile */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          overflow-hidden rounded-2xl
          border border-slate-200
          bg-white shadow-sm
        "
      >
        <div className="grid md:grid-cols-[280px_1fr]">

          {/* Image */}

          <div className="aspect-square bg-slate-100 md:aspect-auto">
            {player.image ? (
              <img
                src={player.image}
                alt={player.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center">
                <UserRound
                  size={70}
                  className="text-slate-300"
                />
              </div>
            )}
          </div>

          {/* Information */}

          <div className="p-6 sm:p-8">

            <div className="flex flex-wrap items-start justify-between gap-4">

              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {player.name}
                </h1>

                {player.location && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} />
                    {player.location}
                  </div>
                )}
              </div>

              <div className="
                flex items-center gap-2
                rounded-full
                bg-[#0078BD]/10
                px-3 py-1.5
                text-sm font-semibold
                text-[#0078BD]
              ">
                <Trophy size={15} />
                {player.skillLevel || "Beginner"}
              </div>

            </div>

            {/* Games */}

            <div className="mt-8">

              <div className="flex items-center gap-2">
                <Gamepad2
                  size={18}
                  className="text-[#0078BD]"
                />

                <h2 className="font-semibold text-slate-900">
                  Preferred Games
                </h2>
              </div>

              {games.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  {games.map((game) => (
                    <div
                      key={game._id}
                      className="
                        overflow-hidden
                        rounded-xl
                        border border-slate-200
                      "
                    >
                      <div className="aspect-[16/9] bg-slate-100">
                        {game.image ? (
                          <img
                            src={game.image}
                            alt={game.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Gamepad2
                              size={35}
                              className="text-slate-300"
                            />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900">
                          {game.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {game.type}
                        </p>

                        {player._id !== user?._id && (
                          <button
                            onClick={() =>
                              handleSendRequest(game)
                            }
                            disabled={
                              requestingGame === game._id
                            }
                            className="
                              mt-4 flex w-full
                              items-center justify-center
                              gap-2 rounded-lg
                              bg-[#0078BD]
                              px-4 py-2.5
                              text-sm font-semibold
                              text-white
                              transition
                              hover:bg-[#0069A7]
                              disabled:cursor-not-allowed
                              disabled:opacity-60
                            "
                          >
                            {requestingGame === game._id ? (
                              <>
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send size={16} />
                                Find Partner
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                </div>
              ) : (
                <div className="
                  mt-4 rounded-xl
                  border border-dashed
                  border-slate-300
                  p-6 text-center
                ">
                  <p className="text-sm text-slate-500">
                    This player hasn't selected any games yet.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerProfile;