
import express from "express";
import Post from "../models/Post.js";
import cloudinaryUploader from "../utils/cloudinary.js";

const router = express.Router();

router.patch("/:postId/cover", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { cover: req.file.path },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: "Post non trovato" });
    }
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: "Errore nel caricamento della copertina" });
  }
});

// GET tutti i post

router.get("/", async (req, res) => {
  try {
    const { title } = req.query;
    const query = title ? { title: { $regex: title, $options: 'i' } } : {};
    const posts = await Post.find(query);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei post" });
  }
});

// router.get("/", (req, res) => {
//   res.send("Questa è la route dei post");
// });

// router.get("/", async (req, res) => {
//   try {
//     const posts = await Post.find();
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ error: "Errore nel recupero dei post" });
//   }
// });


// routes/blogPosts.js

router.get("/posts/authors/:authorId/posts", async (req, res) => {
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
    const post = await Post.findById(req.params.id).populate("author"); // <-- questo è fondamentale
    if (!post) return res.status(404).send("Post non trovato");
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore del server");
  }
});


// POST nuovo post
// router.post("/", async (req, res) => {
//   console.log("📩 Ricevuta POST /posts");
//   try {
//     const newPost = new Post(req.body);
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// POST con upload immagine
router.post("/", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    const newPost = new Post({
      title,
      content,
      authorId,
      cover: req.file?.path, // URL Cloudinary se presente
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Errore nel POST /posts:", error);
    res.status(400).json({ error: "Errore nella creazione del post" });
  }
});

// PUT modifica post
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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



