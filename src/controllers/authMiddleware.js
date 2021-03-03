const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/userModel");
const { verifyJWT } = require("./authTools");
const UserModel = mongoose.model("User", UserSchema);

const authorize = async (req, res, next) => {
  try {
    // const token = req.header("Authorization").replace("Bearer ", "");
    const token = req.cookies.accessToken;
    const decoded = await verifyJWT(token);
    const user = await UserModel.findById({
      _id: decoded._id,
    });
    // console.log(decoded);
    if (!user) {
      const err = new Error({ error: "Please authenticate" });
      err.httpStatusCode = 403;
      next(err);
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

module.exports = { authorize };
