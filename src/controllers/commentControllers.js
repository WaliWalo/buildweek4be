const mongoose = require('mongoose')
const CommentSchema = require('../models/commentModel')
const Comment = mongoose.model("Comment", CommentSchema)
const { authorize } = require('./authTools')

getComments = async (req, res, next) => {
}

const addNewComment = async (req, res, next) => {
    
    try {
        let newComment = new Comment(req.body);
        if (req.body.commentId) {
            let commentSquared = await newComment.save();
            console.log("comment of a comment", commentSquared);
            res.send(commentSquared);
        } else { 
            let comment = await newComment.save()
            comment.commentId = comment._id
            res.send(comment)
        }
    } catch (error) {
    error.httpStatusCode = 400;
    next(error);
  }
};



module.exports = {addNewComment}