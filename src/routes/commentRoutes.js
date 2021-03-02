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
  app.route("/comments").post(addNewComment).get(getComments);

  app
    .route("/comments/:commentId")
    .get(getCommentById)
    .put(updateComment)
    .delete(deleteComment);

  app.route("/comments/more/:commentId").get(getMoreComments);

  app.route("/comments/:commentId/:userId").post(addRemoveLike);
};

module.exports = routes;
