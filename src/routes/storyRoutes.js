const {
  addStory,
  cloudMulter,
  getStory,
  deleteStory,
} = require("../controllers/storyControllers");

const { authorize } = require("../controllers/authMiddleware");

const routes = (app) => {
  app
    .route("/stories")
    .get(authorize, getStory)
    .post(authorize, cloudMulter.single("picture"), addStory);
  app.route("/stories/:storyId").delete(authorize, deleteStory);
};

module.exports = routes;
