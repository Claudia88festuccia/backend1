 import express from "express";
import authenticateToken from "../routes/middleware/authMiddleware.js";
import Author from "../models/Author.js";

const router = express.Router();

// router.get("/me", authenticateToken, async (req, res) => {
//   const user = await Author.findById(req.user.id).select("-password");
//   if (!user) return res.status(404).json({ error: "Utente non trovato" });

//   res.json(user);
// });

export default router;
