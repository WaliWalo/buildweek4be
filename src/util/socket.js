const MessageModel = require("../models/MessageModel");
const ConversationModel = require("../models/ConversationModel");

const createConversation = (participants) => {
  try {
    //CREATE A CONVERSATION BETWEEN PARTICIPANTS
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
