
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Author from "../models/Author.js"; 
import cloudinaryUploader from "../utils/cloudinary.js";

const router = express.Router();

router.patch("/:authorId/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    const { authorId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "Nessun file inviato" });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      authorId,
      { avatar: req.file.path }, // req.file.path = URL immagine da Cloudinary
      { new: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ error: "Autore non trovato" });
    }

    res.status(200).json(updatedAuthor);
  } catch (err) {
    console.error("Errore nel caricamento avatar:", err);
    res.status(500).json({ error: "Errore nel caricamento avatar" });
  }
});

export default router;




