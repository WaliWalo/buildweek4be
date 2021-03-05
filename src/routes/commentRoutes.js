const {
  addRemoveLike,
  getMoreComments,
  getComments,
  getCommentById,
  addNewComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentControllers");
const { authorize } = require("../controllers/authMiddleware");

const routes = (app) => {
  app
    .route("/comments")
    .post(authorize, addNewComment)
    .get(authorize, getComments);

  app
    .route("/comments/:commentId")
    .get(authorize, getCommentById)
    .put(authorize, updateComment)
    .delete(authorize, deleteComment);

  app.route("/comments/more/:commentId").get(authorize, getMoreComments);

  app.route("/comments/:commentId/:userId").post(authorize, addRemoveLike);
};

module.exports = routes;
