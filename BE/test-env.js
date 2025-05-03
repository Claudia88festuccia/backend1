import dotenv from "dotenv";
dotenv.config();

console.log("Test .env:");
console.log("CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME);
console.log("CLOUDINARY_KEY:", process.env.CLOUDINARY_KEY);
console.log("CLOUDINARY_KEY_SECRET:", process.env.CLOUDINARY_KEY_SECRET);
