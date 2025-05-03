
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import Author from "../models/Author.js"; 

const router = express.Router();

// Configurazione di Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_KEY_SECRET,
});

console.log("Cloudinary Config:", {
  name: process.env.CLOUDINARY_NAME,
  key: process.env.CLOUDINARY_KEY,
  secret: process.env.CLOUDINARY_KEY_SECRET,
});


// Configurazione dello storage su Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'avatars',  
    format: async () => {'png'||'jpg'||'jpeg'||'webp'},  
    public_id: (req, file) => file.originalname.split('.')[0],  
  },
});

const upload = multer({ storage });


// Route per caricare l'avatar dell'autore
router.patch("/:authorId/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const author = await Author.findById(req.params.authorId);
    if (!author) {
      return res.status(404).json({ error: "Autore non trovato" });
    }

    // Salva l'URL dell'avatar nel documento dell'autore
    author.avatar = req.file.path; 
    await author.save();

    res.json({ message: "Avatar aggiornato con successo", author });
  } catch (error) {
    res.status(500).json({ error: "Errore durante il caricamento dell'avatar" });
  }
});


export default router;




