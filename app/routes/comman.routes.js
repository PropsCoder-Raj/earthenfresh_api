const controller = require("../controllers/comman.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/profile/info",controller.getProfileInfo);
  app.post("/api/upload", [authJwt.verifyToken, authJwt.isAdmin],controller.uploadFile);
  app.get("/api/retrieve/:file/:token", [authJwt.verifyToken],controller.retrieveFile);
  app.get("/api/download/:file",controller.downloadCSVFile);
  
};
