const controller = require("../controllers/notification.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/notification/create", [authJwt.verifyToken, authJwt.isAdmin],controller.createNotification);
  app.get("/api/notification", [authJwt.verifyToken],controller.getAllNotification);
};

