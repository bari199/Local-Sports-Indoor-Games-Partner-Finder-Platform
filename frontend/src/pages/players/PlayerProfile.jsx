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
  Send,
  Trophy,
  UserRound,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { getPlayerById } from "../../services/playerService";
import { sendPartnerRequest } from "../../services/partnerRequestService";
import useAuth from "../../hooks/useAuth";

const PlayerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [player, setPlayer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [requestingGame, setRequestingGame] =
    useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);

        const response =
          await getPlayerById(id);

        if (response.success) {
          setPlayer(response.player);
        } else {
          toast.error(
            response.message ||
              "Player not found"
          );
        }
      } catch (error) {
        console.error(
          "Get player error:",
          error
        );

        toast.error(
          "Unable to load player profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  const handleSendRequest = async (
    game
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setRequestingGame(game._id);

      const response =
        await sendPartnerRequest({
          receiverId: player._id,
          gameId: game._id,
        });

      if (response.success) {
        toast.success(
          "Partner request sent successfully"
        );
      } else {
        toast.error(
          response.message ||
            "Unable to send request"
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
      <div className="
        flex
        min-h-[70vh]
        items-center
        justify-center
      ">
        <div className="flex flex-col items-center gap-3">

          <Loader2
            size={28}
            className="
              animate-spin
              text-[#0078BD]
            "
          />

          <p className="
            text-sm
            text-slate-500
          ">
            Loading player profile...
          </p>

        </div>
      </div>
    );
  }

  if (!player) {
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
          <UserRound size={24} />
        </div>

        <h2 className="
          mt-5
          text-xl
          font-bold
          text-slate-900
        ">
          Player not found
        </h2>

        <Button
          variant="outline"
          onClick={() =>
            navigate("/players")
          }
          className="mt-5 rounded-xl"
        >
          <ArrowLeft size={16} />
          Back to players
        </Button>
      </div>
    );
  }

  const games =
    player.preferredGames || [];

  const skillStyles = {
    Beginner:
      "border-slate-200 bg-slate-50 text-slate-600",
    Intermediate:
      "border-amber-200 bg-amber-50 text-amber-700",
    Advanced:
      "border-[#0078BD]/20 bg-[#0078BD]/10 text-[#0078BD]",
  };

  const skillClass =
    skillStyles[player.skillLevel] ||
    skillStyles.Beginner;

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

        {/* Back */}

        <Button
          variant="ghost"
          onClick={() =>
            navigate("/players")
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
          Back to players
        </Button>

        {/* =====================================================
            PROFILE HERO
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
              md:grid-cols-[280px_1fr]
            ">

              {/* Image */}

              <div className="
                relative
                aspect-square
                overflow-hidden
                bg-slate-100
                md:aspect-auto
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
                  <div className="
                    flex
                    h-full
                    min-h-[280px]
                    items-center
                    justify-center
                  ">
                    <UserRound
                      size={70}
                      strokeWidth={1.2}
                      className="text-slate-300"
                    />
                  </div>
                )}

                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/25
                  to-transparent
                " />

              </div>

              {/* Information */}

              <CardContent className="
                flex
                flex-col
                justify-center
                p-6
                sm:p-8
                lg:p-10
              ">

                <div className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#0078BD]/15
                  bg-[#0078BD]/5
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[#0078BD]
                ">
                  <Sparkles size={13} />
                  Player profile
                </div>

                <div className="
                  mt-4
                  flex
                  flex-wrap
                  items-start
                  justify-between
                  gap-4
                ">

                  <div>

                    <h1 className="
                      text-3xl
                      font-black
                      tracking-tight
                      text-slate-950
                      sm:text-4xl
                    ">
                      {player.name}
                    </h1>

                    <div className="
                      mt-2
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-slate-500
                    ">
                      <MapPin
                        size={16}
                        className="text-[#0078BD]"
                      />

                      {player.location ||
                        "Location not provided"}
                    </div>

                  </div>

                  <Badge
                    variant="secondary"
                    className={`
                      border
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      ${skillClass}
                    `}
                  >
                    <Trophy
                      size={14}
                      className="mr-1.5"
                    />

                    {player.skillLevel ||
                      "Beginner"}
                  </Badge>

                </div>

                <div className="
                  mt-8
                  grid
                  grid-cols-2
                  gap-3
                  sm:max-w-md
                ">

                  <div className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                  ">
                    <p className="
                      text-2xl
                      font-black
                      text-slate-950
                    ">
                      {games.length}
                    </p>

                    <p className="
                      mt-1
                      text-xs
                      text-slate-400
                    ">
                      Preferred games
                    </p>
                  </div>

                  <div className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                  ">
                    <p className="
                      text-2xl
                      font-black
                      text-slate-950
                    ">
                      {player.skillLevel ||
                        "Beginner"}
                    </p>

                    <p className="
                      mt-1
                      text-xs
                      text-slate-400
                    ">
                      Skill level
                    </p>
                  </div>

                </div>

              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* =====================================================
            GAMES
        ===================================================== */}

        <section className="mt-10">

          <div className="
            mb-5
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:items-end
            sm:justify-between
          ">

            <div>

              <div className="
                flex
                items-center
                gap-2
              ">
                <Gamepad2
                  size={19}
                  className="text-[#0078BD]"
                />

                <h2 className="
                  text-xl
                  font-black
                  tracking-tight
                  text-slate-950
                ">
                  Preferred games
                </h2>
              </div>

              <p className="
                mt-1
                text-sm
                text-slate-500
              ">
                Games this player enjoys.
              </p>

            </div>

            {games.length > 0 && (
              <Badge
                variant="secondary"
                className="w-fit"
              >
                {games.length}{" "}
                {games.length === 1
                  ? "game"
                  : "games"}
              </Badge>
            )}

          </div>

          {games.length > 0 ? (
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
              "
            >
              {games.map((game) => (
                <motion.div
                  key={game._id}
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
                    overflow-hidden
                    border-slate-200/80
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-lg
                  ">

                    <div className="
                      relative
                      aspect-[16/9]
                      overflow-hidden
                      bg-slate-100
                    ">

                      {game.image ? (
                        <motion.img
                          src={game.image}
                          alt={game.name}
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                          whileHover={{
                            scale: 1.03,
                          }}
                          transition={{
                            duration: 0.35,
                          }}
                        />
                      ) : (
                        <div className="
                          flex
                          h-full
                          items-center
                          justify-center
                        ">
                          <Gamepad2
                            size={38}
                            className="text-slate-300"
                          />
                        </div>
                      )}

                      <div className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/60
                        to-transparent
                      " />

                      <h3 className="
                        absolute
                        bottom-4
                        left-4
                        text-xl
                        font-bold
                        text-white
                      ">
                        {game.name}
                      </h3>

                    </div>

                    <CardContent className="p-5">

                      <div className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      ">

                        <div>
                          <p className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-wider
                            text-slate-400
                          ">
                            Game type
                          </p>

                          <p className="
                            mt-1
                            text-sm
                            font-semibold
                            text-slate-700
                          ">
                            {game.type ||
                              "Sport"}
                          </p>
                        </div>

                        {player._id !==
                          user?._id && (
                          <Button
                            onClick={() =>
                              handleSendRequest(
                                game
                              )
                            }
                            disabled={
                              requestingGame ===
                              game._id
                            }
                            className="
                              rounded-xl
                              bg-[#0078BD]
                              hover:bg-[#0069A7]
                            "
                          >
                            {requestingGame ===
                            game._id ? (
                              <>
                                <Loader2
                                  size={15}
                                  className="animate-spin"
                                />
                                Sending
                              </>
                            ) : (
                              <>
                                <Send size={15} />
                                Find Partner
                              </>
                            )}
                          </Button>
                        )}

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
                py-14
                text-center
              ">
                <Gamepad2
                  size={34}
                  className="
                    mx-auto
                    text-slate-300
                  "
                />

                <h3 className="
                  mt-4
                  font-semibold
                  text-slate-900
                ">
                  No preferred games
                </h3>

                <p className="
                  mt-1
                  text-sm
                  text-slate-500
                ">
                  This player hasn't selected
                  any games yet.
                </p>
              </CardContent>
            </Card>
          )}

        </section>

      </div>
    </main>
  );
};

export default PlayerProfile;