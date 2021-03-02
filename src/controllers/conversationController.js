const ConversationModel = require("../models/ConversationModel");
const MessageModel = require("../models/MessageModel");

const getConversations = async (req, res, next) => {
  try {
    const conversation = await ConversationModel.find({
      $or: [
        { creator: req.params.userId },
        {
          creator2: req.params.userId,
        },
      ],
    });
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
    });
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

module.exports = { getMessages, getConversations };
