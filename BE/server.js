
import dotenv from "dotenv";
dotenv.config();
console.log("Env Variables:", {
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_KEY_SECRET: process.env.CLOUDINARY_KEY_SECRET,
});
import express from "express";
import cors from "cors";
import Author from "./models/Author.js";
import authorsRouter from "./routes/authors.js";
import postsRouter from "./routes/posts.js";
import connectDB from "./db.js"; 
import cloudinaryUploader from "./utils/cloudinary.js";
import Post from "./models/Post.js";
import commentsRouter from "./routes/comments.js";  



const app = express();

connectDB().then(() => {
    // Avvia il server solo se la connessione è riuscita
    app.listen(process.env.PORT || 3001, () => {
        console.log("Server in esecuzione sulla porta " + (process.env.PORT || 3001));
    });
}).catch(err => {
    console.error("Errore nel tentativo di connessione al database:", err);
});

// Configurazione CORS
const corsOptions = {
  origin: "http://localhost:3000", 
  methods: "GET, POST, PUT, DELETE, PATCH", 
  allowedHeaders: "Content-Type, Authorization", 
};

app.use(express.json());
app.use(commentsRouter)
app.use(cors(corsOptions));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});



// Rotte per autori e post
app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);



// Endpoint di base
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/authors', (req, res) => {
  console.log("Richiesta ricevuta per gli autori");
  Author.find()
    .then(authors => res.json(authors))
    .catch(err => {
      console.error("Errore:", err);
      res.status(500).send('Errore nel recupero degli autori');
    });
});

app.get("/posts", async (req, res) => {
  try {
    const { title, authorId } = req.query;

    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" }; // Cerca in modo case-insensitive
    }

    if (authorId) {
      query.authorId = authorId;
    }

    const posts = await Post.find(query);
    res.json(posts);
  } catch (error) {
    console.error("Errore nel recupero dei post:", error);
    res.status(500).json({ error: "Errore nel recupero dei post" });
  }
});


app.post('/authors', async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor); // Risposta con l'autore creato
  } catch (error) {
    res.status(400).json({ error: "Errore nella creazione dell'autore" });
  }
});



connectDB();

// Middleware per la gestione degli errori
app.use((err, req, res, next) => {
  console.error("Errore nel server:", err); 
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  } else {
    return res.status(500).json({ error: "Errore interno del server" });
  }
});


