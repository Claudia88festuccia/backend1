import express from "express";
import Post from "../models/Post.js";

const router = express.Router();
  

  // Ottieni un commento specifico di un post
router.get("/posts/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post non trovato" });
      }
  
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ error: "Commento non trovato" });
      }
  
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: "Errore nel recupero del commento" });
    }
  });
  

  // Aggiungi un nuovo commento a un post
router.post("/posts/:id/comments", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post non trovato" });
      }
  
      const { user, text } = req.body;  // Dati del commento inviati nel body
      if (!user || !text) {
        return res.status(400).json({ error: "Autore e testo del commento sono obbligatori" });
      }
  
      const newComment = { user, text };
      post.comments.push(newComment);  // Aggiungi il commento all'array
  
      await post.save();
      res.status(201).json(newComment);  // Rispondi con il nuovo commento
    } catch (error) {
      res.status(500).json({ error: "Errore nell'aggiunta del commento" });
    }
  });

  
  // Modifica un commento di un post
router.put("/posts/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
      .populate("author", "name avatar")
      .exec();  

      if (!post) {
        return res.status(404).json({ error: "Post non trovato" });
      }
  
      const comment = post.comments.id(req.params.commentId)
      .populate("author")
      .exec();
      if (!comment) {
        return res.status(404).json({ error: "Commento non trovato" });
      }
  
      // Modifica il commento
      const { user, text } = req.body;
      if (user) comment.user = user;
      if (text) comment.text = text;
  
      await post.save();
      res.json(comment);  // Rispondi con il commento modificato
    } catch (error) {
      res.status(500).json({ error: "Errore nella modifica del commento" });
    }
  });
  

  // Elimina un commento specifico di un post
router.delete("/posts/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post non trovato" });
      }
  
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ error: "Commento non trovato" });
      }
  
      comment.remove();  // Rimuovi il commento
      await post.save();
      res.json({ message: "Commento eliminato con successo" });
    } catch (error) {
      res.status(500).json({ error: "Errore nell'eliminazione del commento" });
    }
  });

  
  export default router;
  