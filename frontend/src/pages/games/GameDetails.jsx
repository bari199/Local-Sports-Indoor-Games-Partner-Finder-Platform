import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpRight,
  Gamepad2,
  Loader2,
  MapPin,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";

import { motion } from "framer-motion";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { getGameById } from "../../services/gameService";
import { getPlayers } from "../../services/playerService";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [players, setPlayers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          gameResponse,
          playersResponse,
        ] = await Promise.all([
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
                (preferredGame) =>
                  preferredGame._id === id
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
        flex
        min-h-[70vh]
        items-center
        justify-center
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
        mx-auto
        max-w-5xl
        px-4
        py-16
        text-center
      ">
        <div className="
          mx-auto
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-slate-100
          text-slate-400
        ">
          <Gamepad2 size={25} />
        </div>

        <h2 className="
          mt-5
          text-xl
          font-bold
          text-slate-900
        ">
          Game not found
        </h2>

        <Button
          variant="outline"
          onClick={() =>
            navigate("/games")
          }
          className="mt-5 rounded-xl"
        >
          <ArrowLeft size={16} />
          Back to games
        </Button>
      </div>
    );
  }

  return (
    <main className="
      min-h-screen
      bg-[#F8FAFC]
    ">

      <div className="
        mx-auto
        max-w-6xl
        px-4
        py-8
        sm:px-6
        lg:px-8
        lg:py-10
      ">

        <Button
          variant="ghost"
          onClick={() =>
            navigate("/games")
          }
          className="
            mb-6
            -ml-2
            rounded-xl
            text-slate-500
            hover:text-[#0078BD]
          "
        >
          <ArrowLeft size={17} />
          Back to games
        </Button>

        {/* =====================================================
            GAME HERO
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          <Card className="
            overflow-hidden
            border-slate-200/80
            bg-white
            shadow-sm
          ">

            <div className="
              grid
              md:grid-cols-[340px_1fr]
            ">

              {/* Image */}

              <div className="
                relative
                aspect-[4/3]
                overflow-hidden
                bg-slate-100
                md:aspect-auto
              ">

                {game.image ? (
                  <img
                    src={game.image}
                    alt={game.name}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <div className="
                    flex
                    h-full
                    min-h-[280px]
                    items-center
                    justify-center
                  ">
                    <Gamepad2
                      size={60}
                      strokeWidth={1.3}
                      className="text-slate-300"
                    />
                  </div>
                )}

                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/40
                  to-transparent
                " />

              </div>

              {/* Content */}

              <CardContent className="
                flex
                flex-col
                justify-center
                p-6
                sm:p-8
                lg:p-10
              ">

                <Badge
                  variant="secondary"
                  className="
                    w-fit
                    border
                    border-[#0078BD]/15
                    bg-[#0078BD]/5
                    text-[#0078BD]
                  "
                >
                  {game.type || "Sport"}
                </Badge>

                <h1 className="
                  mt-4
                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-950
                  sm:text-4xl
                ">
                  {game.name}
                </h1>

                <p className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-7
                  text-slate-500
                  sm:text-base
                ">
                  {game.description ||
                    "Find players who enjoy this game."}
                </p>

                <div className="
                  mt-7
                  flex
                  flex-wrap
                  gap-3
                ">

                  <div className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                  ">
                    <Users
                      size={17}
                      className="text-[#0078BD]"
                    />

                    <span className="
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      {players.length}{" "}
                      {players.length === 1
                        ? "player"
                        : "players"}
                    </span>
                  </div>

                  <div className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                  ">
                    <Trophy
                      size={17}
                      className="text-[#FFB800]"
                    />

                    <span className="
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      Find your partner
                    </span>
                  </div>

                </div>

              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* =====================================================
            PLAYERS
        ===================================================== */}

        <section className="mt-10">

          <div className="
            mb-5
            flex
            items-end
            justify-between
            gap-4
          ">

            <div>

              <div className="
                flex
                items-center
                gap-2
              ">
                <Users
                  size={19}
                  className="text-[#0078BD]"
                />

                <h2 className="
                  text-xl
                  font-black
                  tracking-tight
                  text-slate-950
                ">
                  Players
                </h2>
              </div>

              <p className="
                mt-1
                text-sm
                text-slate-500
              ">
                Players looking for partners
                in {game.name}.
              </p>

            </div>

            <Badge
              variant="secondary"
              className="hidden sm:flex"
            >
              {players.length} found
            </Badge>

          </div>

          {players.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.04,
                  },
                },
              }}
              className="
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {players.map((player) => (
                <motion.div
                  key={player._id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 10,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                >
                  <Card className="
                    group
                    border-slate-200/80
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-lg
                  ">

                    <CardContent className="p-5">

                      <div className="
                        flex
                        items-center
                        gap-4
                      ">

                        <div className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-2xl
                          bg-slate-100
                        ">

                          {player.image ? (
                            <img
                              src={player.image}
                              alt={player.name}
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          ) : (
                            <UserRound
                              size={22}
                              className="text-slate-400"
                            />
                          )}

                        </div>

                        <div className="min-w-0">

                          <h3 className="
                            truncate
                            font-bold
                            text-slate-950
                          ">
                            {player.name}
                          </h3>

                          <div className="
                            mt-1
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            text-slate-400
                          ">
                            <MapPin size={13} />

                            <span className="truncate">
                              {player.location ||
                                "Location not provided"}
                            </span>
                          </div>

                        </div>

                      </div>

                      <div className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        gap-3
                      ">

                        <Badge
                          variant="secondary"
                          className="
                            border-0
                            bg-slate-100
                            text-slate-600
                          "
                        >
                          {player.skillLevel ||
                            "Beginner"}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/players/${player._id}`
                            )
                          }
                          className="
                            rounded-lg
                            text-[#0078BD]
                            hover:bg-[#0078BD]/10
                            hover:text-[#0078BD]
                          "
                        >
                          View Profile
                          <ArrowUpRight
                            size={15}
                          />
                        </Button>

                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="
              border-dashed
              border-slate-300
              shadow-none
            ">
              <CardContent className="
                px-6
                py-16
                text-center
              ">

                <div className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                  text-slate-400
                ">
                  <UserRound size={25} />
                </div>

                <h3 className="
                  mt-5
                  font-bold
                  text-slate-900
                ">
                  No players yet
                </h3>

                <p className="
                  mt-2
                  text-sm
                  text-slate-500
                ">
                  No players have selected
                  this game yet.
                </p>

              </CardContent>
            </Card>
          )}

        </section>

      </div>
    </main>
  );
};

export default GameDetails;