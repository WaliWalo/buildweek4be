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
    // const currentUser = await User.findById(participants.currentUserId);
    // if (participants.selectedUser) {
    //   const selectedUser = await User.findById(participants.selectedUserId);
    //   if (currentUser && selectedUser) {

    //     if (findConversation.length === 0) {
    //       const newConversation = new ConversationModel({
    //         creator: participants.currentUserId,
    //         creator2: participants.selectedUserId,
    //         participants: [
    //           participants.currentUserId,
    //           participants.selectedUserId,
    //         ],
    //       });
    //       const saved = await newConversation.save();
    //       return saved;
    //     } else {
    //       return { error: "convo existing" };
    //     }
    //   } else {
    //     return { error: "user not found" };
    //   }
    // }
  } catch (error) {
    console.log(error);
  }
};

const createMessage = (messageObject) => {
  try {
    //CREATE MESSAGE
    // {convoId, sender, content, url}
  } catch (error) {
    console.log(error);
  }
};

const deleteMessage = (messageId) => {
  try {
    //ONLY SENDER CAN DELETE
  } catch (error) {
    console.log(error);
  }
};

const addParticipantToConvo = (participant, convoId) => {
  try {
    //ADD PARTICIPANT TO USER, UPDATE EXISTING CONVO
    //ONLY CREATOR CAN ADD
  } catch (error) {
    console.log(error);
  }
};

const removeParticipantFromConvo = (participant, convoId) => {
  try {
    //ADD PARTICIPANT TO USER, UPDATE EXISTING CONVO
    //ONLY CREATOR CAN REMOVE
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

module.exports = {
  createConversation,
  createMessage,
  deleteMessage,
  addParticipantToConvo,
  removeParticipantFromConvo,
  getUsersInConvo,
};
