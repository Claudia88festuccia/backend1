import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dataDiNascita: { type: String },
  avatar: { type: String }
}, { timestamps: true });

const Author = mongoose.model("Author", AuthorSchema);

export default Author;
