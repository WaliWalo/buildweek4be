const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MessageSchema = new Schema(
  {
    conversationId: {
      type: mongoose.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: { type: String },
    url: { type: String },
    sender: { type: mongoose.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
