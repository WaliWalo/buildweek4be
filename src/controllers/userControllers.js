const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const User = mongoose.model("User", UserSchema);
const { authenticate, refresh } = require("./authTools");
const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile",
  },
});

const cloudMulter = multer({ storage: cloudStorage });

const postProfilePic = async (req, res, next) => {
  try {
    const addPic = await User.findByIdAndUpdate(req.user._id, {
      $set: {
        picture: req.file.path,
      },
    });
    if (addPic) {
      res.status(200).send(addPic);
    } else {
      const err = new Error(`User Id: ${req.user._id} not found`);
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    error = new Error();
    error.httpStatusCode = 404;
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      let error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const followUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const findFollower = user.following.filter(
        (follower) => follower.toString() === req.params.userId
      );
      console.log(findFollower);
      if (findFollower.length > 0) {
        const newFollowing = user.following.filter(
          (follower) => follower.toString() !== req.params.userId
        );
        await User.findByIdAndUpdate(
          req.user._id,
          {
            $set: {
              following: newFollowing,
            },
          },
          { runValidators: true, new: true }
        );
        res.status(200).send("Follower removed");
      } else {
        console.log(user.following);
        console.log(mongoose.Types.ObjectId(req.params.userId));
        let userId = mongoose.Types.ObjectId(req.params.userId);
        await User.findByIdAndUpdate(
          req.user._id,
          {
            $push: {
              following: userId,
            },
          },
          { runValidators: true, new: true }
        );
        res.status(200).send("Follower added");
      }
    } else {
      let error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const updateUser = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
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
  User.findOneAndDelete({ _id: req.user._id }, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.send(`${req.user._id} deleted`);
    }
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    if (user === null) {
      res.status(404).send({ error: "user not found" });
    } else if (user.error) {
      res.status(403).send(user);
    } else {
      const token = await authenticate(user);
      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        path: "/refreshToken",
      });
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

const refreshToken = async (req, res, next) => {
  try {
    // Grab the refresh token
    console.log(req.cookies);
    const oldRefreshToken = req.cookies.refreshToken;

    // Verify the token
    // If it's ok generate new access token and new refresh token
    const { accessToken, refreshToken } = await refresh(oldRefreshToken);

    // send them back
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/refreshToken",
    });
    res.send("tokens are refreshed");
  } catch (error) {
    next(error);
  }
};

const googleAuthenticate = async (req, res, next) => {
  try {
    res.cookie("accessToken", req.user.tokens.token, {
      httpOnly: true,
    });
    res.cookie("refreshToken", req.user.tokens.refreshToken, {
      httpOnly: true,
      path: "/refreshToken",
    });

    res.status(200).redirect(process.env.FE_URL);
  } catch (error) {
    next(error);
  }
};

const facebookAuthenticate = async (req, res, next) => {
  try {
    res.cookie("accessToken", req.user.tokens.token, {
      httpOnly: true,
    });
    res.cookie("refreshToken", req.user.tokens.refreshToken, {
      httpOnly: true,
      path: "/refreshToken",
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
  refreshToken,
  getUser,
  facebookAuthenticate,
  postProfilePic,
  cloudMulter,
  followUser,
};
