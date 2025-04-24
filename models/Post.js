import mongoose from "mongoose";
import Author from "./Author.js";  // Importa il modello Author

const PostSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
        value: { type: Number, required: true },
        unit: { type: String, required: true },
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,  // Usa ObjectId per collegare l'autore
        ref: "Author",  // Riferimento al modello Author
        required: true,
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
