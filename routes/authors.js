import express from "express";
import Author from "../models/Author.js";

const router = express.Router();

// GET tutti gli autori
router.get("/", async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
});

// GET autore singolo
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.json(author);
    } else {
      res.status(404).send("Autore non trovato");
    }
  } catch (error) {
    res.status(400).send("ID non valido");
  }
});

// POST nuovo autore

router.post("/", async (req, res) => {
  try {
    const { nome, cognome, email } = req.body;

    // Verifica se i campi obbligatori sono presenti
    if (!nome || !cognome || !email) {
      return res.status(400).json({ error: "Tutti i campi obbligatori devono essere forniti" });
    }

    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// router.post("/", (req, res) => {
//     res.send(req.body);
//     console.log(req.body);
// })
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("Connected to MongoDB");
//     } catch (error) {
//         console.log(error);
//     }
// }
// connectDB();

// PUT modifica autore
router.put("/:id", async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedAuthor) {
      res.json(updatedAuthor);
    } else {
      res.status(404).send("Autore non trovato");
    }
  } catch (error) {
    res.status(400).send("Errore durante l'update");
  }
});

// DELETE autore
router.delete("/:id", async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (deletedAuthor) {
      res.json({ message: "Autore eliminato" });
    } else {
      res.status(404).send("Autore non trovato");
    }
  } catch (error) {
    res.status(400).send("Errore durante la cancellazione");
  }
});

export default router;
