const PostModel = require("../models/postModel");
const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const getPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.find().populate({
      path: "user",
      select: ["_id", "firstName", "lastName"],
    });
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const addNewPost = async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body);
    const { _id } = await newPost.save();
    res.status(201).send(newPost);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId).populate({
      path: "user",
      select: ["_id", "firstName", "lastName"],
    });
    if (post) {
      res.status(200).send(post);
    } else {
      const error = new Error(`Post with id ${req.params.postId} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const editPost = async (req, res, next) => {
  try {
    const modifiedPost = await PostModel.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { runValidators: true, new: true }
    );
    if (modifiedPost) {
      res.status(200).send(modifiedPost);
    } else {
      const error = new Error(`Post with id ${req.params.postId} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.params.postId);
    if (deletedPost) {
      res.status(203).send("Deleted");
    } else {
      const error = new Error(`Post with id ${req.params.postId} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "posts",
  },
});

const cloudMulter = multer({ storage: cloudStorage });

const postPicture = async (req, res, next) => {
  try {
    console.log("path of url", req.files);

    let fileArray = [];

    for (let i = 0; i < req.files.length; i++) {
      fileArray.push(req.files[i].path);
    }

    const addPicture = await PostModel.findByIdAndUpdate(req.params.postId, {
      $set: {
        urls: fileArray,
      },
    });

    if (addPicture) {
      res.status(200).send(addPicture);
    } else {
      const err = new Error(`Post Id: ${req.params.postId} not found`);
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getPosts,
  addNewPost,
  getPostById,
  editPost,
  deletePost,
  cloudMulter,
  postPicture,
};
