import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

// Configurazione Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_KEY_SECRET,
});

// Storage con Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "avatars", // Cartella Cloudinary
    format: async (req, file) => {
      const fileFormat = file.mimetype.split("/")[1]; // Estrae il tipo del file (jpg, png, etc.)
      // Verifica che sia tra i formati consentiti
      const allowedFormats = ["jpg", "jpeg", "png", "webp"];
      return allowedFormats.includes(fileFormat) ? fileFormat : "jpg"; // Default to "jpg" se non è valido
    },
    public_id: (req, file) => {
      // Crea un ID unico per evitare sovrascritture, ad esempio un prefisso con l'ID dell'utente e un timestamp
      return `avatar_${Date.now()}_${file.originalname}`;
    },
  },
});

const cloudinaryUploader = multer({ storage });

export default cloudinaryUploader;

