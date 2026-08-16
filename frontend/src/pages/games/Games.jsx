import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Gamepad2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Footer from "@/components/common/Footer";
import GiftBanner from "@/components/common/GiftBanner";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
            response.message ||
              "Unable to load games"
          );
        }
      } catch (error) {
        console.error(
          "Get games error:",
          error
        );

        toast.error(
          "Unable to load games"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return games;
    }

    return games.filter(
      (game) =>
        game.name
          ?.toLowerCase()
          .includes(value) ||
        game.type
          ?.toLowerCase()
          .includes(value) ||
        game.description
          ?.toLowerCase()
          .includes(value)
    );
  }, [games, search]);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <GiftBanner/>

      <div className="
        mx-auto
        max-w-7xl
        px-4
        py-8
        sm:px-6
        lg:px-8
        lg:py-10
      ">

        {/* =====================================================
            HERO
        ===================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="
            relative
            mb-8
            overflow-hidden
            rounded-3xl
            border
            border-slate-200/80
            bg-white
            p-6
            shadow-sm
            sm:p-8
          "
        >

          <div className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-56
            w-56
            rounded-full
            bg-[#0078BD]/10
            blur-3xl
          " />

          <div className="
            relative
            flex
            flex-col
            gap-6
            md:flex-row
            md:items-end
            md:justify-between
          ">

            <div>

              <div className="
                mb-3
                inline-flex
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
                Explore sports
              </div>

              <h1 className="
                text-3xl
                font-black
                tracking-tight
                text-slate-950
                sm:text-4xl
              ">
                Find your
                <span className="text-[#0078BD]">
                  {" "}game.
                </span>
              </h1>

              <p className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
                sm:text-base
              ">
                Explore sports and connect with
                players who share your interests.
              </p>

            </div>

            {!loading && (
              <div className="
                flex
                shrink-0
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
              ">

                <div className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#0078BD]/10
                  text-[#0078BD]
                ">
                  <Gamepad2 size={18} />
                </div>

                <div>
                  <p className="
                    text-lg
                    font-bold
                    leading-none
                    text-slate-950
                  ">
                    {games.length}
                  </p>

                  <p className="
                    mt-1
                    text-[11px]
                    text-slate-400
                  ">
                    Games available
                  </p>
                </div>

              </div>
            )}

          </div>
        </motion.section>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <section className="
          mb-8
          rounded-2xl
          border
          border-slate-200/80
          bg-white
          p-3
          shadow-sm
          sm:p-4
        ">

          <div className="relative max-w-2xl">

            <Search
              size={17}
              className="
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
              placeholder="Search games..."
              className="
                h-11
                rounded-xl
                border-slate-200
                bg-slate-50
                pl-10
                pr-10
                shadow-none
                focus-visible:bg-white
                focus-visible:ring-[#0078BD]/15
              "
            />

            {search && (
              <button
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
                <X size={16} />
              </button>
            )}

          </div>
        </section>

        {/* =====================================================
            RESULTS
        ===================================================== */}

        {!loading && (
          <div className="
            mb-5
            flex
            items-center
            justify-between
          ">

            <div className="flex items-center gap-2">

              <p className="
                text-sm
                font-medium
                text-slate-600
              ">
                {filteredGames.length}{" "}
                {filteredGames.length === 1
                  ? "game"
                  : "games"}{" "}
                available
              </p>

              {search && (
                <Badge
                  variant="secondary"
                  className="
                    bg-[#0078BD]/10
                    text-[#0078BD]
                  "
                >
                  Search
                </Badge>
              )}

            </div>

          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          ">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-white
                  shadow-sm
                "
              >
                <Skeleton className="
                  aspect-[16/10]
                  w-full
                  rounded-none
                " />

                <div className="space-y-4 p-5">

                  <Skeleton className="h-5 w-20 rounded-full" />

                  <Skeleton className="h-6 w-32" />

                  <Skeleton className="h-10 w-full" />

                  <Skeleton className="
                    h-10
                    w-full
                    rounded-xl
                  " />

                </div>
              </div>
            ))}
          </div>
        )}

        {/* =====================================================
            GAMES
        ===================================================== */}

        {!loading &&
          filteredGames.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.035,
                  },
                },
              }}
              className="
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {filteredGames.map(
                (game) => (
                  <GameCard
                    key={game._id}
                    game={game}
                  />
                )
              )}
            </motion.div>
          )}

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading &&
          filteredGames.length === 0 && (
            <motion.div
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
              }}
              className="
                rounded-3xl
                border
                border-dashed
                border-slate-300
                bg-white
                px-6
                py-16
                text-center
              "
            >

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

              <h3 className="
                mt-5
                text-base
                font-bold
                text-slate-900
              ">
                No games found
              </h3>

              <p className="
                mx-auto
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-slate-500
              ">
                Try searching for another
                sport or game.
              </p>

              {search && (
                <Button
                  variant="outline"
                  onClick={() =>
                    setSearch("")
                  }
                  className="
                    mt-5
                    rounded-xl
                  "
                >
                  Clear search
                </Button>
              )}

            </motion.div>
          )}

      </div>
      <Footer/>
    </main>
  );
};

export default Games;