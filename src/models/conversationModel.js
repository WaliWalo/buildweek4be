const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ConversationSchema = new Schema(
  {
    participants: [{ type: mongoose.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
