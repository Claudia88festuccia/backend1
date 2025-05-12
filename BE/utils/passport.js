import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import dotenv from "dotenv"
import Author from "../models/Author.js"
import { createAccessToken } from "../routes/tools.js"
// import session from 'express-session'


dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"http://localhost:3001/auth/google/callback" ,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("👉 Profilo Google ricevuto:", profile)
        const existing = await Author.findOne({ googleId: profile.id })

        if (existing) return done(null, existing)

        const newUser = new Author({
          googleId: profile.id,
          nome: profile.name.givenName,
          cognome: profile.name.familyName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          password: "", 
        })

        await newUser.save()
        done(null, newUser)
      } catch (err) {
        done(err)
      }
    }
  )
)

// Serializzazione dell'utente
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Author.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
