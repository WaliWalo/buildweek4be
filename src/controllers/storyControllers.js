const StoryModel = require("../models/storyModel");
const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { getVideoDurationInSeconds } = require("get-video-duration");

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stories",
  },
});

const cloudMulter = multer({ storage: cloudStorage });

const getStory = async (req, res, next) => {
  try {
    const stories = await StoryModel.find().populate({
      path: "user",
      select: ["_id", "firstName", "lastName", "picture"],
    });
    res.status(200).send(stories);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const addStory = async (req, res, next) => {
  try {
    const story = { user: req.user._id, story: req.file.path };
    const duration = await getVideoDurationInSeconds(req.file.path);
    console.log("duration---->", duration);
    const addStory = new StoryModel(story);

    await addStory.save();
    res.status(201).send(addStory);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteStory = async (req, res, next) => {
  try {
    await StoryModel.findByIdAndDelete(req.params.storyId);
    res.status(203).send("Story is deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getStory,
  cloudMulter,
  addStory,
  deleteStory,
};
