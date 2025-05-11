 import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // es. email dell'utente
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  cover: String,
  readTime: {
    value: Number,
    unit: String,
  },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  content: String,
  comments: [CommentSchema], 
  createdAt: { type: Date, default: Date.now },
})

const Post = mongoose.model("Post", PostSchema)

export default Post
