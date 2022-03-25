const fcmtokensController = require("../controllers/fcmtokens.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/fcmtokens", [authJwt.verifyToken],fcmtokensController.getAllFcmtokens);
    app.get("/api/fcmtokens/:id", [authJwt.verifyToken],fcmtokensController.getSingleFcmtokens);
    app.get("/api/fcmtokens/user/:cid", [authJwt.verifyToken],fcmtokensController.getUsersFcmtokens);
    app.post("/api/fcmtokens", [authJwt.verifyToken],fcmtokensController.createFcmtokens);
    app.put("/api/fcmtokens/:id", [authJwt.verifyToken],fcmtokensController.updateFcmtokens);
    app.delete("/api/fcmtokens/:id", [authJwt.verifyToken],fcmtokensController.deleteFcmtokens);
};