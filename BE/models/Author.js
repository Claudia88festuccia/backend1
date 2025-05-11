
import mongoose from "mongoose";
import bcrypt from "bcrypt"

const AuthorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  birthDate: { type: String },
  avatar: { type: String }, 
  googleId: { type: String },
})

AuthorSchema.statics.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email })
  if (!user) return null

  const isMatch = await bcrypt.compare(password, user.password)
  return isMatch ? user : null
}

const Author = mongoose.model("Author", AuthorSchema);

export default Author;