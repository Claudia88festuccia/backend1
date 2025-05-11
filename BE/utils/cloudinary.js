// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";
// import dotenv from "dotenv";
// dotenv.config();

// // Configurazione Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_KEY_SECRET,
// });

// // Storage con Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "avatars", // Cartella Cloudinary
//     allowedFormats: ["jpg", "jpeg", "png", "webp"],
//     format: async (req, file) => {
//       const fileFormat = file.mimetype.split("/")[1]; // Estrae il tipo del file (jpg, png, etc.)
//       // Verifica che sia tra i formati consentiti
//       const allowedFormats = ["jpg", "jpeg", "png", "webp"];
//       return allowedFormats.includes(fileFormat) ? fileFormat : "jpg"; // Default to "jpg" se non è valido
//     },
//     public_id: (req, file) => {
//       // Crea un ID unico per evitare sovrascritture, ad esempio un prefisso con l'ID dell'utente e un timestamp
//       return `avatar_${Date.now()}_${file.originalname}`;
//     },
//   },
// });

// const cloudinaryUploader = multer({ storage });

// export default cloudinaryUploader;


import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_KEY_SECRET,
});

/**
 * Crea un uploader multer con cartella specificata
 * @param {string} folder - Nome della cartella su Cloudinary (es. "avatars", "post-covers")
 * @returns multer instance
 */
export const createUploader = (folder = "uploads") =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: {
        folder,
        allowedFormats: ["jpg", "jpeg", "png", "webp"],
        format: async (req, file) => {
          const ext = file.mimetype.split("/")[1];
          const allowed = ["jpg", "jpeg", "png", "webp"];
          return allowed.includes(ext) ? ext : "jpg";
        },
        public_id: (req, file) => `${folder}_${Date.now()}_${file.originalname}`,
      },
    }),
  });

