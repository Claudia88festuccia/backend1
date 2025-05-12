
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

// cloudinary.uploader.upload("path/to/file.jpg", function (error, result) {
//   console.log("CLOUDINARY_URL",result.secure_url);
// });

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

