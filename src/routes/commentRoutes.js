const {getComments, addNewComment} = require("../controllers/commentControllers")
const { authorize } = require("../controllers/authMiddleware");


const routes = (app) => {

    

    app.route("/comments").post(addNewComment).get(getComments)
};

module.exports = routes;
