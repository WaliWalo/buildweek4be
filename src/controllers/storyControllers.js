const StoryModel = require("../models/storyModel");
const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { getVideoDurationInSeconds } = require("get-video-duration");
const moment = require("moment");
const Agenda = require("agenda");
const Conversation = require("../models/ConversationModel");

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
            { resource_type: result.resources[0].resource_type },
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
    const deletedStory = await StoryModel.findByIdAndDelete(req.params.storyId);
    let urlArray = deletedStory.story.split("stories");
    let fileName = "stories" + urlArray[1];

    cloudinary.search
      .expression(fileName)
      .sort_by("public_id", "desc")
      .execute()
      .then((result) => {
        cloudinary.uploader.destroy(
          result.resources[0].public_id,
          { resource_type: result.resources[0].resource_type },
          (err) => {
            console.log(err);
            console.log(result.resources[0].public_id, " deleted");
          }
        );
      });
    res.status(203).send("Story is deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const calculteDate = (createdAt) => {
  let date = moment(createdAt).add(24, "hours").format();
  // date.replace("Moment<", "");
  return date;
};

agenda.define("delete old stories", async (job) => {
  //"86400000"

  const stories = await StoryModel.find();

  let req;
  stories.forEach(async (element) => {
    if (calculteDate(element.createdAt) <= moment().format()) {
      let urlArray = element.story.split("stories");
      let fileName = "stories" + urlArray[1];
      console.log(fileName);
      console.log(urlArray);
      req = await StoryModel.findByIdAndDelete(element._id);

      cloudinary.search
        .expression(fileName)
        .sort_by("public_id", "desc")
        .execute()
        .then((result) => {
          cloudinary.uploader.destroy(
            result.resources[0].public_id,
            { resource_type: result.resources[0].resource_type },
            (err) => {
              console.log(err);
              console.log(result.resources[0].public_id, " deleted");
            }
          );
        });
    }
  });
});

agenda.define("delete old conversation", async () => {
  const conversations = await Conversation.find();

  conversations.forEach(async (convo) => {
    if (convo.oneDay) {
      if (calculteDate(convo.createdAt) <= moment().format()) {
        let req = await Conversation.findByIdAndDelete(convo._id);
      }
    }
  });
});

(async function () {
  await agenda.start();

  await agenda.every("1 hour", [
    "delete old stories",
    "delete old conversation",
  ]);
})();

module.exports = {
  getStory,
  cloudMulter,
  addStory,
  deleteStory,
};
