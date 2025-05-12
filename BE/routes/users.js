 import express from "express";
import authenticateToken from "../routes/middleware/authMiddleware.js";
import Author from "../models/Author.js";

const router = express.Router();


export default router;
