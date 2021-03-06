const { authorize } = require("../controllers/authMiddleware");
const {
  getConversations,
  getMessages,
  cloudMulter,
  getImgUrl,
} = require("../controllers/conversationController");

const routes = (app) => {
  // GET CONVERSATIONS BY USER ID
  app.route("/conversation/:userId").get(authorize, getConversations);
  // GET CONVERSATION BY CONVO ID
  app.route("/messages/getMessage/:convoId").get(authorize, getMessages);
  // user use this endpoint to get image url, return url to client
  // (then emit with the url to store image=>this is from front end)
  app
    .route("/messages/postPic")
    .post(authorize, cloudMulter.single("picture"), getImgUrl);
};

module.exports = routes;
