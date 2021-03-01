const express = require("express");
const cors = require("cors");
const { join } = require("path");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const oauth = require("./controllers/oauth");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const {
  notFoundHandler,
  forbiddenHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const server = express();
const whitelist = ["http://localhost:3000", "http://localhost:4000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, //to allow cookies
};
const port = process.env.PORT;
server.use(cors(corsOptions));
// const staticFolderPath = join(__dirname, "../public");
// server.use(express.static(staticFolderPath));
server.use(express.json());

server.use(cookieParser());
server.use(passport.initialize());
userRoutes(server);
postRoutes(server);
commentRoutes(server);

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port);
    })
  )
  .catch((err) => console.log(err));
