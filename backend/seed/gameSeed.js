import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Game from "../models/Game.js";

dotenv.config();

const games = [
  {
    name: "Badminton",
    type: "Racquet Sport",
    description:
      "A fast-paced indoor racquet sport played in singles or doubles.",
  },
  {
    name: "Table Tennis",
    type: "Indoor Sport",
    description:
      "A fast indoor paddle sport played on a table between two or four players.",
  },
  {
    name: "Basketball",
    type: "Team Sport",
    description:
      "A team sport where players score by shooting a ball through a basketball hoop.",
  },
  {
    name: "Football",
    type: "Team Sport",
    description:
      "A team sport played by two teams competing to score goals.",
  },
  {
    name: "Cricket",
    type: "Bat-and-Ball Sport",
    description:
      "A bat-and-ball team sport played between two teams on a cricket field.",
  },
  {
    name: "Volleyball",
    type: "Team Sport",
    description:
      "A team sport where players hit a ball over a net to score points.",
  },
  {
    name: "Chess",
    type: "Board Game",
    description:
      "A strategic two-player board game focused on planning and tactical play.",
  },
  {
    name: "Carrom",
    type: "Indoor Board Game",
    description:
      "A popular indoor tabletop game played by striking discs into corner pockets.",
  },
];

const seedGames = async () => {
  try {
    await connectDB();

    await Game.deleteMany();

    await Game.insertMany(games);

    console.log("Games seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Game seeding failed:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedGames();