const { authorize } = require("../controllers/authMiddleware");
const {
  getConversations,
  getMessages,
} = require("../controllers/conversationController");

const routes = (app) => {
  app.route("/conversation").get(authorize, getConversations);
  app.route("/conversation/:userId").get(authorize);
  app.route("/message/getMessage/:convoId").get(authorize, getMessages);
  //user use this endpoint to get image url, then emit with the url to store image
  app.route("/messages/postPic").post(authorize);
};

module.exports = routes;
