import mongoose from "mongoose";
import Author from "./Author.js";  

const CommentSchema = new mongoose.Schema({
    user: { type: String, required: true },  
    text: { type: String, required: true },  
    createdAt: { type: Date, default: Date.now },  
  });

const PostSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
        value: { type: Number, required: true },
        unit: { type: String, required: true },
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Author", 
        required: true,
    },
    comments: {
        type: [CommentSchema],  
        default: [],
    },
    content: { type: String, required: true }
}, {
  timestamps: true 
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
