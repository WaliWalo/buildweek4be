const ConversationModel = require("../models/conversationModel");
const MessageModel = require("../models/messageModel");
const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat",
  },
});

const cloudMulter = multer({ storage: cloudStorage });

const getConversations = async (req, res, next) => {
  try {
    const conversation = await ConversationModel.find({
      participants: { $elemMatch: { $eq: req.params.userId } },
    }).populate(["creator", "participants", "creator2"]);
    if (conversation) {
      res.send(conversation);
    } else {
      const err = new Error();
      err.message = `This conversation doesn't exist `;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const msgs = await MessageModel.find({
      convoId: req.params.convoId,
    }).populate(["to", "sender"]);
    if (msgs) {
      res.send(msgs);
    } else {
      const err = new Error();
      err.message = `This message doesn't exist `;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(err);
  }
};

const getImgUrl = async (req, res, next) => {
  try {
    res.send({ imageUrl: req.file.path });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getMessages, getConversations, cloudMulter, getImgUrl };
