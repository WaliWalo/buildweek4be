const {
  getPosts,
  addNewPost,
  getPostById,
  editPost,
  deletePost,
  cloudMulter,
  postPicture,
  addRemoveLike,
} = require("../controllers/postControllers");
const { authorize } = require("../controllers/authMiddleware");

const routes = (app) => {
  app.route("/posts").get(authorize, getPosts).post(authorize, addNewPost);

  app
    .route("/posts/:postId")
    .get(authorize, getPostById)
    .put(authorize, editPost)
    .delete(authorize, deletePost);

  app
    .route("/posts/:postId/postPicture")
    .post(authorize, cloudMulter.array("picture", 12), postPicture);
  app
    .route("/posts/:postId/addRemoveLike/:userId")
    .post(authorize, addRemoveLike);
};

module.exports = routes;
