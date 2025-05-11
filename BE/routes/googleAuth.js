import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()


router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {failureRedirect: "/login", session: false }),
    (req, res) => {

        console.log(" Google user:", req.user) // <-- Aggiungi questo log

        if (!req.user) {
            return res.status(500).send("Login Google fallito: utente non ricevuto")
        }

        const token = jwt.sign(
            { _id: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        )

        res.redirect(`http://localhost:3000/google-success?token=${token}`)
    }
)

export default router
