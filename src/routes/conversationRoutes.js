const { authorize } = require("../controllers/authMiddleware");
const {
  createConversation,
  createMessage,
  deleteMessage,
} = require("../controllers/conversationController");

const routes = (app) => {
  app.route("/conversation").post(authorize, createConversation);

  app
    .route("/message/:convoId")
    .post(authorize, createMessage)
    .delete(authorize, deleteMessage);
};

module.exports = routes;
