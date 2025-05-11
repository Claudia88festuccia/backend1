

import express from "express";
import session from "express-session";
import passport from 'passport';
import dotenv, { config } from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import googleAuthRouter from "./routes/googleAuth.js";
import "./utils/passport.js";



dotenv.config();

const app = express();

// Configurazione CORS
const corsOptions = {
  // origin: "http://localhost:3000", 
  origin: "https://backend1-pi-wine.vercel.app",
  methods: "GET, POST, PUT, DELETE, PATCH", 
  allowedHeaders: "Content-Type, Authorization", 
};

app.use(cors(corsOptions));

// Middleware per la gestione delle sessioni
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize())
app.use(passport.session());

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(googleAuthRouter)
app.use(commentsRouter)

connectDB().then(() => {
    // Avvia il server solo se la connessione è riuscita
    app.listen(process.env.PORT || 3001, () => {
        console.log("Server in esecuzione sulla porta " + (process.env.PORT || 3001));
    });
}).catch(err => {
    console.error("Errore nel tentativo di connessione al database:", err);
});


console.log("Env Variables:", {
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_KEY_SECRET: process.env.CLOUDINARY_KEY_SECRET,
});


import Author from "./models/Author.js";
import authorsRouter from "./routes/authors.js";
import postsRouter from "./routes/posts.js"; 
import { createUploader } from "./utils/cloudinary.js";
const cloudinaryUploader = createUploader("avatars")
import Post from "./models/Post.js";
import commentsRouter from "./routes/comments.js";  
import usersRouter from "./routes/users.js";
import loginRouter from "./routes/login.js";


// Rotte per autori e post
app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/login",loginRouter);


// Endpoint di base
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get('/authors', (req, res) => {
//   console.log("Richiesta ricevuta per gli autori");
//   Author.find()
//     .then(authors => res.json(authors))
//     .catch(err => {
//       console.error("Errore:", err);
//       res.status(500).send('Errore nel recupero degli autori');
//     });
// });

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




// Middleware per la gestione degli errori
app.use((err, req, res, next) => {
  console.error("Errore nel server:", err); 
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  } else {
    return res.status(500).json({ error: "Errore interno del server" });
  }
});

