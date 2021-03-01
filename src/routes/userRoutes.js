const {
  getUsers,
  addNewUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  logout,
  googleAuthenticate,
} = require("../controllers/userControllers");
const { authorize } = require("../controllers/authMiddleware");
const passport = require("passport");

const routes = (app) => {
  app.route("/users").get(authorize, getUsers);

  app
    .route("/users/:userId")
    .get(authorize, getUserById)
    .put(authorize, updateUser)
    .delete(authorize, deleteUser);

  app.route("/register").post(addNewUser);
  app.route("/login").post(login);
  app.route("/logout").post(logout);
  app
    .route("/googleLogin")
    .get(passport.authenticate("google", { scope: ["profile", "email"] }));
  app
    .route("/googleRedirect")
    .get(passport.authenticate("google"), googleAuthenticate);
};

module.exports = routes;
