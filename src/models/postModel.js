const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    urls: [{ url: { type: String } }],
    likes: [{ userId: { type: Schema.Types.ObjectId, ref: "User" } }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
