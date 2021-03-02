const StoryModel = require("../models/storyModel");
const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { getVideoDurationInSeconds } = require("get-video-duration");
const moment = require("moment");
const Agenda = require("agenda");

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_CONNECTION,
    options: { useUnifiedTopology: true },
  },
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stories",
    resource_type: "auto",
    allowed_formats: ["jpg", "mp4"],
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
    console.log("file---->", req.file);

    if (duration < 10.01) {
      const addStory = new StoryModel(story);

      await addStory.save();
      res.status(201).send(addStory);
    } else {
      cloudinary.search
        .expression(req.file.filename)
        .sort_by("public_id", "desc")
        .execute()
        .then((result) => {
          cloudinary.uploader.destroy(
            result.resources[0].public_id,
            { resource_type: "video" },
            (err) => {
              console.log(err);
              console.log(result.resources[0].public_id, " deleted");
            }
          );
        });

      const err = new Error();
      err.message = "Video should not be longer than 10 seconds";
      err.httpStatusCode = 403;
      next(err);
    }
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

agenda.define("delete old stories", async (job) => {
  //"86400000"
  const calculteDate = (createdAt) => {
    let date = moment(createdAt).add(24, "hours").format();
    // date.replace("Moment<", "");
    return date;
  };

  const stories = await StoryModel.find();
  console.log(stories);

  let req;
  stories.forEach(async (element) => {
    if (calculteDate(element.createdAt) <= moment().format()) {
      req = await StoryModel.findByIdAndDelete(element._id);
    }
  });
});

(async function () {
  await agenda.start();

  await agenda.every("1 hour", "delete old stories");
})();

module.exports = {
  getStory,
  cloudMulter,
  addStory,
  deleteStory,
};
