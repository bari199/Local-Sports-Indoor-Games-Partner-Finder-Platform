import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Game from "../models/Game.js";

dotenv.config();

const games = [
  {
    name: "Badminton",
    type: "Racquet Sport",
    image:"https://res.cloudinary.com/diqr1juvf/image/upload/v1786209638/Esha_Biswas_lfctvo.jpg",
    description:
      "A fast-paced indoor racquet sport played in singles or doubles.",
  },
  {
    name: "Table Tennis",
    type: "Indoor Sport",
    image:"https://res.cloudinary.com/diqr1juvf/image/upload/v1786213253/image_1_2_j2kmts.jpg",
    description:
      "A fast indoor paddle sport played on a table between two or four players.",
  },
  {
    name: "Basketball",
    type: "Team Sport",
    image:"https://res.cloudinary.com/diqr1juvf/image/upload/v1786213361/image_1786213341876_q5xrqo.jpg",
    description:
      "A team sport where players score by shooting a ball through a basketball hoop.",
  },
  {
    name: "Football",
    type: "Team Sport",
    image:"https://res.cloudinary.com/diqr1juvf/image/upload/v1786213508/image_1786213488670_kqxbsd.jpg",
    description:
      "A team sport played by two teams competing to score goals.",
  },
  {
    name: "Cricket",
    type: "Bat-and-Ball Sport",
    image:"https://res.cloudinary.com/diqr1juvf/image/upload/v1786213639/image_1786213616023_h9hqy2.jpg",
    description:
      "A bat-and-ball team sport played between two teams on a cricket field.",
  },
  {
    name: "Volleyball",
    type: "Team Sport",
    image:"https://res.cloudinary.com/diqr1juvf/image/upload/v1786213711/image_1786213691991_dzopmu.jpg",
    description:
      "A team sport where players hit a ball over a net to score points.",
  },
  {
    name: "Chess",
    type: "Board Game",
    image:"",
    description:
      "A strategic two-player board game focused on planning and tactical play.",
  },
  {
    name: "Carrom",
    type: "Indoor Board Game",
    image:"https://res.cloudinary.com/diqr1juvf/image/upload/v1786213880/image_1_4_fbstar.jpg",
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