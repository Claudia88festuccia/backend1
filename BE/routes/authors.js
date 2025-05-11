import express from "express"
import Author from "../models/Author.js"
import bcrypt from "bcrypt"
import { createUploader } from "../utils/cloudinary.js"
import authenticateToken from "../routes/middleware/authMiddleware.js"

const router = express.Router()

const cloudinaryUploader = createUploader("avatars")

router.post("/", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    const { nome, cognome, email, password, birthDate, googleId } = req.body

    //  Verifica i campi obbligatori comuni
    if (!nome || !cognome || !email) {
      return res.status(400).json({ error: "Campi obbligatori mancanti." })
    }

    // Se NON è un utente Google, la password è obbligatoria
    if (!googleId && !password) {
      return res.status(400).json({ error: "La password è obbligatoria per la registrazione manuale." })
    }

    //  Cripta la password solo se presente
    const hashedPassword = password ? await bcrypt.hash(password, 10) : ""

    const newAuthor = new Author({
      nome,
      cognome,
      email,
      password: hashedPassword,
      birthDate,
      avatar: req.file?.path,
      googleId,
    })

    const savedAuthor = await newAuthor.save()
    res.status(201).json(savedAuthor)
  } catch (error) {
    console.error("Errore creazione autore:", error)
    res.status(500).json({ error: "Errore nella creazione dell'autore" })
  }
})

router.get("/", async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
});


router.put("/:id",authenticateToken, async (req, res) => {
  try {
    const updates = { ...req.body }

    // Se l'utente ha cambiato password, criptala
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10)
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )

    if (!updatedAuthor) return res.status(404).json({ error: "Autore non trovato" })
    res.json(updatedAuthor)
  } catch (err) {
    console.error("Errore nella modifica:", err)
    res.status(500).json({ error: "Errore durante la modifica dell'autore" })
  }
})

router.patch("/:id/avatar", authenticateToken, cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ error: "Autore non trovato" });

    author.avatar = req.file.path;
    await author.save();
    console.log("Ricevuta PATCH per autore con ID:", req.params.id);

    res.json({ message: "Avatar aggiornato", avatar: author.avatar });

  } catch (err) {
    console.error("Errore aggiornamento avatar:", err);
    res.status(500).json({ error: "Errore durante l'aggiornamento dell'avatar" });
  }
});


router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: "Autore non trovato" })
    res.json({ message: "Autore eliminato con successo" })
  } catch (err) {
    console.error("Errore nella cancellazione:", err)
    res.status(500).json({ error: "Errore durante la cancellazione" })
  }
})

export default router