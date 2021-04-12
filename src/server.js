const express = require("express");
const cors = require("cors");
const { join } = require("path");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const conversationController = require("./routes/conversationRoutes");
const storyRoutes = require("./routes/storyRoutes");
const oauth = require("./controllers/oauth");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const http = require("http");
const createSocketServer = require("./socket");
const {
  notFoundHandler,
  notAuthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const server = express();
server.set("trust proxy", 1);
server.enable("trust proxy");
const httpServer = http.createServer(server);
createSocketServer(httpServer);
const whitelist = [`${process.env.REACT_APP_FE_URL}`];
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
userRoutes(server); //"user"
postRoutes(server);
commentRoutes(server);
conversationController(server);
storyRoutes(server);

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestHandler);
server.use(notAuthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.REACT_APP_MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    httpServer.listen(port || 5000, () => {
      console.log("Running on port", port);
    })
  )
  .catch((err) => console.log(err));
