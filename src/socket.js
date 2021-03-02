const socketio = require("socket.io");
const {
  createConversation,
  createMessage,
  deleteMessage,
  addParticipantToConvo,
  removeParticipantFromConvo,
  getUsersInConvo,
} = require("./util/socket");

const createSocketServer = (server) => {
  const io = socketio(server);

  io.on("connection", (socket) => {
    console.log(`New socket connection --> ${socket.id}`);

    //start conversation
    socket.on("createConvo", async ({ currentUserId, participants }) => {
      try {
        // socket
        //   .to(anotherSocketId)
        //   .emit("private message", { sender: socket.id, msg });
        const newConvo = await createConversation({
          currentUserId,
          participants,
        });
        console.log(newConvo);
      } catch (error) {
        console.log(error);
      }
    });

    //send message

    //leave room

    //delete message
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  });
};

module.exports = createSocketServer;
