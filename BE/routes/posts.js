import mongoose from "mongoose";
import express from "express";
import Post from "../models/Post.js";
import authenticateToken from "../routes/middleware/authMiddleware.js";
import {createUploader} from "../utils/cloudinary.js";
const uploader = createUploader("post-covers");
const router = express.Router();


//carica cover
router.patch(
  "/posts/:id/cover",
  authenticateToken,
  uploader.single("cover"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ error: "Post non trovato" });

      post.cover = req.file.path;
      await post.save();
      res.json({ message: "Cover aggiornata", coverUrl: post.cover });
    } catch (err) {
      console.error("Errore upload cover:", err);
      res.status(500).json({ error: "Errore durante l'upload" });
    }
  }
);


// GET tutti i post

router.get("/posts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const total = await Post.countDocuments()
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .populate("author", "-password")
      .sort({ createdAt: -1 })

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    })
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero dei post" })
  }
})



router.get("/authors/:authorId/posts", async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.authorId });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei post dell'autore" });
  }
});

// GET singolo post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "-password")
    if (!post) return res.status(404).json({ error: "Post non trovato" })
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero del post" })
  }
})

// router.get("/posts/:id", async (req, res) => {
//    try {
//     const post = await Post.findById(req.params.id).populate("author", "-password")
//     if (!post) return res.status(404).json({ error: "Post non trovato" })
//     res.json(post)
//   } catch (error) {
//     console.error("Errore nel fetch del post:", error)
//     res.status(500).json({ error: "Errore interno del server" })
//   }
// }) 


//crea un nuovo post
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, category, content, author, readTime } = req.body

    if (!title || !category || !content  || !readTime?.value || !readTime?.unit) {
      return res.status(400).json({ error: "Dati mancanti" })
    }

    const newPost = new Post({
      title,
      category,
      content,
      author: req.user._id,
      readTime,
      createdAt: new Date(),
    })

    const saved = await newPost.save()
    res.status(201).json(saved)
  } catch (error) {
    console.error("Errore creazione post:", error)
    res.status(500).json({ error: "Errore nella creazione del post" })
  }
})


// PUT modifica post
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (updatedPost) {
      res.json(updatedPost);
    } else {
      res.status(404).json({ error: "Post non trovato" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE elimina post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (deletedPost) {
      res.json({ message: "Post eliminato con successo" });
    } else {
      res.status(404).json({ error: "Post non trovato" });
    }
  } catch (error) {
    res.status(400).json({ error: "Errore nella cancellazione" });
  }
});

export default router;



