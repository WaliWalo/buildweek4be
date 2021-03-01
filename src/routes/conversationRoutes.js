const { authorize } = require("../controllers/authMiddleware");
const {
  getConversations,
  getMessages,
} = require("../controllers/conversationController");

const routes = (app) => {
  app.route("/conversation").get(authorize, getConversations);

  app.route("/message/:convoId").get(authorize, getMessages);
};

module.exports = routes;
