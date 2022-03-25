const controller = require("../controllers/settings.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/settings", [authJwt.verifyToken], controller.getSettings);
  app.post("/api/settings/ecwid/:id", [authJwt.verifyToken], controller.saveEcwid);
  app.post("/api/settings/razorpay/:id", [authJwt.verifyToken], controller.saveRazorpay);
  app.post("/api/settings/refer/:id", [authJwt.verifyToken], controller.saveRefer);
  app.post("/api/settings/cartcheckout/:id", [authJwt.verifyToken], controller.saveCartcheckout);
};