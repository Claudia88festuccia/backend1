
import dotenv from "dotenv";
dotenv.config();
console.log("Env Variables:", {
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_KEY_SECRET: process.env.CLOUDINARY_KEY_SECRET,
});
import express from "express";
import cors from "cors";
import Author from "./BE/models/Author.js";
import authorsRouter from "./BE/routes/authors.js";
import postsRouter from "./BE/routes/posts.js";
import connectDB from "./db.js"; 
import multer from "multer";
import cloudinary from "cloudinary";
import Post from "./BE/models/Post.js";
import commentsRouter from "./BE/routes/comments.js";  
import { CloudinaryStorage } from "multer-storage-cloudinary";

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

// Configurazione Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_KEY_SECRET
});

const storageCloud = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'cloud-upload',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname,
  },
});

const cloud = multer({ storage: storageCloud });

// Rotte per autori e post
app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);
app.use("/blogPosts", postsRouter);

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

app.post('/authors', async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor); // Risposta con l'autore creato
  } catch (error) {
    res.status(400).json({ error: "Errore nella creazione dell'autore" });
  }
});


app.post('/upload', (req, res) => {
  try {
    const file = req.file; // Accesso al file caricato
    cloudinary.uploader.upload(file.path, (result) => {
      if (result.error) {
        res.status(500).json({ error: 'Errore nel caricamento su Cloudinary', details: result.error });
      } else {
        res.status(200).json({ message: 'Caricamento riuscito', data: result });
      }
    });
  } catch (error) {
    console.error('Errore interno del server:', error);
    res.status(500).json({ error: 'Errore interno del server', details: error.message });
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


