import { motion } from "framer-motion";
import { MapPin, Trophy, Gamepad2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PlayerCard = ({ player }) => {
  const navigate = useNavigate();
  const games = player.preferredGames || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="
        overflow-hidden rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-shadow
        hover:shadow-lg
      "
    >
      {/* Player Image */}

      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {player.image ? (
          <img
            src={player.image}
            alt={player.name}
            className="
              h-full w-full object-cover
              transition-transform duration-500
              hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound size={48} className="text-slate-300" />
          </div>
        )}

        {/* Skill Badge */}

        <div
          className="
          absolute right-3 top-3
          rounded-full
          bg-white/95
          px-3 py-1.5
          text-xs font-semibold
          text-[#0078BD]
          shadow-sm
          backdrop-blur
        "
        >
          {player.skillLevel || "Beginner"}
        </div>
      </div>

      {/* Content */}

      <div className="p-5">
        <h3 className="truncate text-lg font-bold text-slate-900">
          {player.name}
        </h3>

        {/* Location */}

        {player.location && (
          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin size={15} />
            <span className="truncate">{player.location}</span>
          </div>
        )}

        {/* Games */}

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Gamepad2 size={14} />
            Preferred Games
          </div>

          {games.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {games.slice(0, 3).map((game) => (
                <span
                  key={game._id}
                  className="
                    rounded-full
                    bg-slate-100
                    px-2.5 py-1
                    text-xs font-medium
                    text-slate-600
                  "
                >
                  {game.name}
                </span>
              ))}

              {games.length > 3 && (
                <span
                  className="
                  rounded-full
                  bg-slate-100
                  px-2.5 py-1
                  text-xs font-medium
                  text-slate-400
                "
                >
                  +{games.length - 3}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No games selected</p>
          )}
        </div>

        {/* Action */}

        <Button
          onClick={() => navigate(`/players/${player._id}`)}
          className="
    mt-5 w-full
    bg-[#0078BD]
    hover:bg-[#0069A7]
  "
        >
          <Trophy size={16} />
          View Player
        </Button>
      </div>
    </motion.div>
  );
};

export default PlayerCard;
