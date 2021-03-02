const { Schema, model } = require("mongoose");

const StorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    story: { type: String, required: true },
  },
  { timestamps: true }
);

const StoryModel = model("Story", StorySchema);

module.exports = StoryModel;
