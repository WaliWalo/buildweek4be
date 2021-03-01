const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const AuthorSchema = require("../models/userModel");
const { verifyJWT } = require("./authTools");
const UserModel = mongoose.model("Author", AuthorSchema);

const authorize = async (req, res, next) => {
  try {
    // const token = req.header("Authorization").replace("Bearer ", "");
    const token = req.cookies.accessToken;
    const decoded = await verifyJWT(token);
    const user = await UserModel.findById({
      _id: decoded._id,
    });
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    const err = new Error({ error: "Please authenticate" });
    err.httpStatusCode = 403;
    next(err);
  }
};

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else {
    const err = new Error("Only for admins!");
    err.httpStatusCode = 403;
    next(err);
  }
};

module.exports = { authorize, adminOnlyMiddleware };
