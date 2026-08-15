import { motion } from "framer-motion";
import {
  MapPin,
  Trophy,
  Gamepad2,
  UserRound,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { useNavigate } from "react-router-dom";

const PlayerCard = ({ player }) => {
  const navigate = useNavigate();

  const games = player.preferredGames || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
    >
      <Card
        className="
          group
          overflow-hidden
          border-slate-200/70
          bg-white
          py-0
          shadow-none
          transition-shadow
          duration-200
          hover:shadow-xl
          hover:shadow-slate-200/50
        "
      >
        {/* =====================================================
            IMAGE
        ===================================================== */}

        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

          {player.image ? (
            <img
              src={player.image}
              alt={player.name}
              loading="lazy"
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                ease-out
                group-hover:scale-[1.04]
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
                bg-gradient-to-br
                from-slate-100
                to-slate-200
              "
            >
              <UserRound
                size={46}
                strokeWidth={1.5}
                className="text-slate-300"
              />
            </div>
          )}

          {/* Image Gradient */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-32
              bg-gradient-to-t
              from-black/60
              to-transparent
            "
          />

          {/* Skill */}

          <Badge
            className="
              absolute
              right-3
              top-3
              border-white/20
              bg-white/90
              text-[#0078BD]
              shadow-sm
              backdrop-blur-md
              hover:bg-white/90
            "
          >
            <Trophy size={12} />

            {player.skillLevel || "Beginner"}
          </Badge>

          {/* Player Name on Image */}

          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="truncate text-lg font-bold tracking-tight text-white">
              {player.name}
            </h3>

            {player.location && (
              <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/80">
                <MapPin size={12} />

                <span className="truncate">
                  {player.location}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="p-4">

          {/* Games Heading */}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Gamepad2 size={13} />

              Preferred games
            </div>

            {games.length > 0 && (
              <span className="text-[11px] font-semibold text-slate-400">
                {games.length}{" "}
                {games.length === 1
                  ? "game"
                  : "games"}
              </span>
            )}
          </div>

          {/* Games */}

          <div className="mt-3 min-h-[30px]">

            {games.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">

                {games.slice(0, 3).map((game) => (
                  <Badge
                    key={game._id}
                    variant="secondary"
                    className="
                      rounded-lg
                      bg-slate-100
                      px-2.5
                      py-1
                      text-[11px]
                      font-medium
                      text-slate-600
                    "
                  >
                    {game.name}
                  </Badge>
                ))}

                {games.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="
                      rounded-lg
                      bg-slate-50
                      px-2.5
                      py-1
                      text-[11px]
                      font-semibold
                      text-slate-400
                    "
                  >
                    +{games.length - 3}
                  </Badge>
                )}

              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No games selected
              </p>
            )}
          </div>

          {/* Action */}

          <Button
            onClick={() =>
              navigate(`/players/${player._id}`)
            }
            className="
              mt-4
              h-10
              w-full
              rounded-xl
              bg-[#0078BD]
              text-sm
              font-semibold
              shadow-none
              transition-colors
              hover:bg-[#0069A7]
            "
          >
            View profile

            <ArrowUpRight size={15} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default PlayerCard;