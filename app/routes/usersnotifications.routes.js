const usersnotificationsController = require("../controllers/usersnotifications.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/usersnotifications", [authJwt.verifyToken],usersnotificationsController.getAllUsersnotifications);
    app.get("/api/usersnotifications/:id", [authJwt.verifyToken],usersnotificationsController.getSingleUsersnotifications);
    app.get("/api/usersnotifications/user/:cid", [authJwt.verifyToken],usersnotificationsController.getUsersUsersnotifications);
    app.post("/api/usersnotifications", [authJwt.verifyToken],usersnotificationsController.createUsersnotifications);
    app.put("/api/usersnotifications/:id", [authJwt.verifyToken],usersnotificationsController.updateUsersnotifications);
    app.delete("/api/usersnotifications/:id", [authJwt.verifyToken],usersnotificationsController.deleteUsersnotifications);
};