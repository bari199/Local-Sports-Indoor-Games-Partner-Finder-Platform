import { motion } from "framer-motion";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="
        overflow-hidden rounded-2xl
        border border-slate-200
        bg-white shadow-sm
        transition-shadow
        hover:shadow-lg
      "
    >
      {/* Image */}

      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        {game.image ? (
          <img
            src={game.image}
            alt={game.name}
            className="
              h-full w-full object-cover
              transition-transform duration-500
              hover:scale-105
            "
          />
        ) : (
          <div className="
            flex h-full items-center
            justify-center
            bg-slate-100
          ">
            <Gamepad2
              size={52}
              className="text-slate-300"
            />
          </div>
        )}
      </div>

      {/* Content */}

      <div className="p-5">

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

        <h3 className="
          mt-3
          text-xl font-bold
          text-slate-900
        ">
          {game.name}
        </h3>

        <p className="
          mt-2
          line-clamp-2
          text-sm leading-6
          text-slate-500
        ">
          {game.description}
        </p>

        <button
          onClick={() => navigate(`/games/${game._id}`)}
          className="
            mt-5 flex w-full
            items-center justify-center
            gap-2 rounded-lg
            border border-slate-200
            bg-white
            px-4 py-2.5
            text-sm font-semibold
            text-slate-700
            transition
            hover:border-[#0078BD]
            hover:bg-[#0078BD]
            hover:text-white
          "
        >
          Explore Players
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default GameCard;