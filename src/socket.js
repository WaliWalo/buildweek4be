const socketio = require("socket.io");
const {
  createConversation,
  createMessage,
  deleteMessage,
  addParticipantToConvo,
  removeParticipantFromConvo,
  getUsersInConvo,
  getAllConvoByUserId,
} = require("./util/socket");

const createSocketServer = (server) => {
  const io = socketio(server);
  io.on("connection", (socket) => {
    console.log(`New socket connection --> ${socket.id}`);
    //join all convo id that the user belong to
    socket.on("userConnected", async ({ userId }) => {
      socket.userId = userId;
      let convos = await getAllConvoByUserId(userId);
      console.log(convos);
      convos.forEach((convo) => {
        socket.join(convo._id);
        socket.broadcast
          .to(convo._id)
          .emit("online", { message: `${userId} is online` });
      });
    });
    //start conversation
    socket.on("createConvo", async ({ currentUserId, participants }) => {
      try {
        const newConvo = await createConversation({
          currentUserId,
          participants,
        });
        socket.join(newConvo._id);
        // participants.forEach((participant) => {
        //   // sockets[participant].join(room);
        // });

        console.log(newConvo);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("addUserToConvo", async ({ convoId, userId }) => {
      try {
        const addUser = await addParticipantToConvo(userId, convoId);
        socket.join(convoId);
        let message = { message: `${userId} has joined the room` };
        socket.broadcast.to(convoId).emit("sendMessage", message);
        console.log(addUser);
      } catch (error) {
        console.log(error);
      }
    });

    //send message
    socket.on("sendMessage", async ({ convoId, sender, url, content }) => {
      try {
        const newMessage = await createMessage({
          convoId,
          sender,
          url,
          content,
        });
        socket.broadcast.to(convoId).emit("sendMessage", newMessage);
        console.log(newMessage);
      } catch (error) {
        console.log(error);
      }
    });

    //leave room
    socket.on("leaveRoom", async ({ convoId, userId, participant }) => {
      try {
        const removeUser = await removeParticipantFromConvo(
          convoId,
          userId,
          participant
        );
        console.log(removeUser);
        if (!removeUser.error) {
          socket.broadcast
            .to(convoId)
            .emit("sendMessage", { msg: `${participant} removed/left` });
        }
      } catch (error) {
        console.log(error);
      }
    });

    //delete message
    socket.on("deleteMessage", async ({ msgId, userId }) => {
      try {
        const deletedMessage = await deleteMessage(msgId, userId);
        console.log(deletedMessage);
        // socket.broadcast
        //   .to(convoId)
        //   .emit("sendMessage", { msg: `${msgId} removed` });
      } catch (error) {
        console.log(error);
      }
    });
  });
};

module.exports = createSocketServer;
