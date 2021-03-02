const MessageModel = require("../models/MessageModel");
const ConversationModel = require("../models/ConversationModel");
const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const User = mongoose.model("User", UserSchema);

const createConversation = async (participants) => {
  try {
    //CREATE A CONVERSATION BETWEEN PARTICIPANTS
    console.log(participants.participants);
    const uniqueParticipants = [...new Set(participants.participants)];
    if (uniqueParticipants.length > 1) {
      //its a group convo
      const newConversation = new ConversationModel({
        creator: participants.currentUserId,
        participants: [participants.currentUserId, ...uniqueParticipants],
      });
      const saved = await newConversation.save();
      return saved;
    } else {
      //its a private convo
      const findConversation = await ConversationModel.find({
        $or: [
          {
            creator: participants.currentUserId,
            creator2: participants.participants[0],
          },
          {
            creator: participants.participants[0],
            creator2: participants.currentUserId,
          },
        ],
      });
      if (findConversation.length === 0) {
        const newConversation = new ConversationModel({
          creator: participants.currentUserId,
          creator2: participants.participants[0],
          participants: [
            participants.currentUserId,
            participants.participants[0],
          ],
        });
        const saved = await newConversation.save();
        return saved;
      } else {
        return { error: "convo existing" };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const createMessage = async (messageObject) => {
  try {
    //CREATE MESSAGE
    const { convoId, sender, content, url } = messageObject;

    const selectedConvo = await ConversationModel.findById(convoId);
    if (selectedConvo) {
      const user = await User.findById(sender);
      if (user) {
        const newConvo = new MessageModel(messageObject);
        const saved = await newConvo.save();
        return saved;
      } else {
        return { error: "user not found" };
      }
    } else {
      return { error: "Convo not found" };
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteMessage = async (messageId, userId) => {
  try {
    //ONLY SENDER CAN DELETE
    console.log(messageId, userId);
    const message = await MessageModel.findById(
      mongoose.Types.ObjectId(messageId)
    );
    if (message.sender.toString() === userId) {
      await MessageModel.findByIdAndDelete(mongoose.Types.ObjectId(messageId));
      return { msg: "message deleted" };
    } else {
      return { error: "Not Authorized" };
    }
  } catch (error) {
    console.log(error);
  }
};

const addParticipantToConvo = async (participant, convoId) => {
  try {
    //ADD PARTICIPANT TO USER, UPDATE EXISTING CONVO
    //ONLY CREATOR CAN ADD
    const selectedConvo = await ConversationModel.findById(convoId);
    if (selectedConvo) {
      const updateConvo = await ConversationModel.findByIdAndUpdate(convoId, {
        $addToSet: { participants: participant },
      });
      return updateConvo;
    } else {
      console.log("convo not found");
    }
  } catch (error) {
    console.log(error);
  }
};

const removeParticipantFromConvo = async (convoId, userId, participant) => {
  try {
    //ADD PARTICIPANT TO USER, UPDATE EXISTING CONVO
    //ONLY CREATOR CAN REMOVE
    const convo = await ConversationModel.findById(convoId);
    console.log(convo.creator.toString() === userId);
    if (
      convo.creator.toString() === userId ||
      convo.creator2.toString() === userId
    ) {
      const updateConvo = await ConversationModel.findByIdAndUpdate(convoId, {
        $pull: { participants: participant },
      });
      return updateConvo;
    } else {
      return { error: "Not authorized" };
    }
  } catch (error) {
    console.log(error);
  }
};

const getUsersInConvo = (convoId) => {
  try {
    //RETURN ALL USERS BELONGING TO CONVOID
  } catch (error) {
    console.log(error);
  }
};

const getAllConvoByUserId = async (userId) => {
  try {
    const convos = await ConversationModel.find({
      $or: [
        {
          creator: userId,
        },
        {
          creator2: userId,
        },
        { participants: userId },
      ],
    });
    return convos;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createConversation,
  createMessage,
  deleteMessage,
  addParticipantToConvo,
  removeParticipantFromConvo,
  getUsersInConvo,
  getAllConvoByUserId,
};
