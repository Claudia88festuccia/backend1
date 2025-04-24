import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// GET tutti i post
// router.get("/", (req, res) => {
//   res.send("Questa è la route dei post");
// });

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei post" });
  }
});

// GET singolo post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post non trovato" });
    }
  } catch (error) {
    res.status(400).json({ error: "ID non valido" });
  }
});

// POST nuovo post
router.post("/", async (req, res) => {
  console.log("📩 Ricevuta POST /posts");
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
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




// import express from "express";
// import Post from "../models/Post.js";

// const router = express.Router();
// console.log("✅ Router dei post caricato");


// router.get("/", (req, res) => {
//     res.send("Questa è la route dei post");
// });

// router.post("/", async (req, res) => {
//     console.log("📩 Ricevuta POST /posts");
//     try {
//         const newPost = new Post(req.body);
//         await newPost.save();
//         res.status(201).json(newPost);
//     } catch (error) {
//       console.log("❌ Errore nel salvataggio:", error.message);
//         res.status(400).json({ error: error.message });
//     }
// });

// export default router;
