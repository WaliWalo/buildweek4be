const {addNewComment} = require("../controllers/commentControllers")
const { authorize } = require("../controllers/authMiddleware");


const routes = (app) => {

    app.route("/comments").post(addNewComment)
};

module.exports = routes;
