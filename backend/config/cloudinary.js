import { v2 as cloudinary } from "cloudinary";

console.log("========== CLOUDINARY CHECK ==========");
console.log(
  "CLOUD NAME:",
  process.env.CLOUDINARY_CLOUD_NAME
);
console.log(
  "API KEY:",
  process.env.CLOUDINARY_API_KEY
    ? "LOADED"
    : "MISSING"
);
console.log(
  "API SECRET:",
  process.env.CLOUDINARY_API_SECRET
    ? "LOADED"
    : "MISSING"
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;