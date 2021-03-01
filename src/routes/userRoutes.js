const {
  getUsers,
  addNewUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  logout,
  googleAuthenticate,
  refreshToken,
  getUser,
  facebookAuthenticate,
  cloudMulter,
  postProfilePic,
  followUser,
} = require("../controllers/userControllers");
const { authorize } = require("../controllers/authMiddleware");
const passport = require("passport");

const routes = (app) => {
  app.route("/users").get(authorize, getUsers);
  app
    .route("/me")
    .get(authorize, getUser)
    .put(authorize, updateUser)
    .delete(authorize, deleteUser);

  app
    .route("/me/postProfilePic")
    .post(authorize, cloudMulter.array("picture", 12), postProfilePic);

  app
    .route("/users/:userId")
    .get(authorize, getUserById)
    .post(authorize, followUser);

  app.route("/refreshToken").get(refreshToken);
  app.route("/register").post(addNewUser);
  app.route("/login").post(login);
  app.route("/logout").post(authorize, logout);
  app
    .route("/googleLogin")
    .get(passport.authenticate("google", { scope: ["profile", "email"] }));
  app
    .route("/googleRedirect")
    .get(passport.authenticate("google"), googleAuthenticate);
  app.route("/facebookLogin").get(
    passport.authenticate("facebook", {
      scope: "email",
    })
  );
  app
    .route("/facebookRedirect")
    .get(
      passport.authenticate("facebook", { failureRedirect: "/login" }),
      facebookAuthenticate
    );
};

module.exports = routes;
