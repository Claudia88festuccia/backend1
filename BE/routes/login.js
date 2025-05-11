import express from "express";
import jwt from "jsonwebtoken";
import Author from "../models/Author.js";
import authenticateToken from "./middleware/authMiddleware.js";
import { createAccessToken } from "./tools.js";
import createError from "http-errors";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Author.checkCredentials(email, password)

    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload)

      res.send({
        accessToken,
        _id: user._id,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        role: user.role,
        avatar: user.avatar
      });
    } else {
      next(createError(401, "Invalid credentials"));
    }

  }
  catch (err) {
    next(err)
  }

})


loginRouter.get("/me", authenticateToken, async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id).select("-password")
    if (!user) return next(createError(404, "Utente non trovato"))
    res.send(user)
  } catch (err) {
    next(err)
  }
})





export default loginRouter