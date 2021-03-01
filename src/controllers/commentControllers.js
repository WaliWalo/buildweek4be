const mongoose = require("mongoose");
const CommentSchema = require("../models/commentModel");
const Comment = mongoose.model("Comment", CommentSchema);
const { authorize } = require("./authTools");

const getParChilComments = async (req, res, next) => {
  try {
    const parentComment = await Comment.findById(req.params.commentId);

    const childrenComments = await Comment.find({
      commentId: { $in: parentComment._id },
    });

    res.status(200).json({ data: "Comment successfully deleted" });
  } catch (err) {
    console.log("Delete comment error", err);
  }
};

//GET all of the comments (regardless if parent/children)
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();
    /*     .populate([
      {
        path: "commentId",
        select: ["content", "userId", "postId"],
      },
      { path: "userId", select: ["firstName", "lastName"] },
    ]); */
    res.send(comments);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//GET specific comment by Id regardless if parent/children
const getCommentById = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  /*     .populate([
    {
      path: "commentId",
      select: ["content", "userId", "postId"],
    },
    { path: "userId", select: ["firstName", "lastName"] },
  ]); */
  console.log(comment);
  res.status(200).send(comment);
};

//POST add new comment
const addNewComment = async (req, res, next) => {
  try {
    const newComment = new Comment(req.body);
    const { _id } = await newComment.save();
    if (req.body.commentId) {
      const parentComment = Comment.findById;
    }
    res.status(201).send(newComment);
  } catch (error) {
    error.httpStatusCode = 400;
    next(error);
  }
};

//PUT edit comment
const updateComment = async (req, res, next) => {
  try {
    Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      req.body,
      { new: true, useFindAndModify: false },
      (err, comment) => {
        if (err) {
          res.send(err);
        }
        res.json(comment);
      }
    );
  } catch (error) {}
};

//DELETE parent comment and even children, if any
const deleteComment = async (req, res, next) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );
    const deletedChildrenComments = await Comment.deleteMany({
      commentId: { $in: deletedComment._id },
    });
    res.status(200).json({ data: "Comment successfully deleted" });
  } catch (err) {
    console.log("Delete comment error", err);
  }
};

module.exports = {
  getParChilComments,
  getComments,
  getCommentById,
  addNewComment,
  updateComment,
  deleteComment,
};
