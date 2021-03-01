const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const User = mongoose.model("User", UserSchema);
const { authenticate } = require("./authTools");

const getUsers = async (req, res, next) => {
  const user = await User.find({});
  if (user.length !== 0) {
    res.status(200).send(user);
  } else {
    let error = new Error();
    error.httpStatusCode = 404;
    next(error);
  }
};

const addNewUser = async (req, res, next) => {
  try {
    let newAuthor = new User(req.body);
    let user = await newAuthor.save();
    console.log("test", user);
    res.status(201).send(user);
  } catch (error) {
    error.httpStatusCode = 400;
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const user = await User.findById(req.params.authorId);
  if (user) {
    res.status(200).send(user);
  } else {
    let error = new Error();
    error.httpStatusCode = 404;
    next(error);
  }
};

const updateUser = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.authorId },
    req.body,
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json(user);
    }
  );
};

const deleteUser = (req, res, next) => {
  User.findOneAndDelete({ _id: req.params.authorId }, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.send(`${req.params.authorId} deleted`);
    }
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    console.log(user);
    if (user === null) {
      res.status(404).send({ error: "user not found" });
    } else if (user.error) {
      res.status(403).send(user);
    } else {
      const token = await authenticate(user);
      console.log(token.token);
      res
        .status(201)
        .cookie("accessToken", token.token, {
          httpOnly: true,
        })
        .send({ status: "ok" });
      // res.status(200).redirect(process.env.FE_URL);
      // res.status(201).send({ status: "ok" });
    }
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    newRefreshTokens = req.user.refreshTokens.filter(
      (token) => token.refreshToken !== req.token.refreshToken
    );
    await req.user.updateOne({ refreshTokens: newRefreshTokens });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.send("ok");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const googleAuthenticate = async (req, res, next) => {
  try {
    res.cookie("accessToken", req.user.tokens.token, {
      httpOnly: true,
    });

    res.status(200).redirect(process.env.FE_URL);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  addNewUser,
  deleteUser,
  updateUser,
  login,
  logout,
  googleAuthenticate,
};
