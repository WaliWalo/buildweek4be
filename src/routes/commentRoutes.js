const {
  getParChilComments,
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
    .get(getParChilComments)
    .get(getCommentById)
    .put(updateComment)
    .delete(deleteComment);
};

module.exports = routes;
