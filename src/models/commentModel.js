const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentSchema = new Schema(
  {
    commentId: { type: Schema.Types.ObjectId }, //if its a reply to a comment add commentId
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    likes: [{ userId: { type: Schema.Types.ObjectId, ref: "User" } }],
  },
  { timestamps: true }
);

module.exports = CommentSchema;
