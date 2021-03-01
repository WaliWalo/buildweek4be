const mongoose = require("mongoose");
const CommentSchema = require("../models/commentModel");
const Comment = mongoose.model("Comment", CommentSchema);
const { authorize } = require("./authTools");

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find().populate([
      {
        path: "commentId",
        select: ["content", "userId", "postId"],
      },
      { path: "userId", select: ["firstName", "lastName"] },
    ]);
    res.send(comments);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const addNewComment = async (req, res, next) => {
  try {
    const newComment = new Comment(req.body);
    const { _id } = await newComment.save();
    res.status(201).send(newComment);
  } catch (error) {
    error.httpStatusCode = 400;
    next(error);
  }
};

module.exports = { getComments, addNewComment };
