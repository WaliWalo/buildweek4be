const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ConversationSchema = new Schema(
  {
    creator: { type: mongoose.ObjectId, ref: "User", required: true },
    creator2: { type: mongoose.ObjectId, ref: "User" },
    participants: [{ type: mongoose.ObjectId, ref: "User", required: true }],
    oneDay: { type: Boolean },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
