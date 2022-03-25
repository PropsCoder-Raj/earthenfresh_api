const bannerController = require("../controllers/banner.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/banner", [authJwt.verifyToken],bannerController.getAllBanner);
    app.get("/api/banner/:id", [authJwt.verifyToken],bannerController.getSingleBanner);
    app.post("/api/banner", [authJwt.verifyToken, authJwt.isAdmin],bannerController.createBanner);
    app.put("/api/banner/:id", [authJwt.verifyToken, authJwt.isAdmin],bannerController.updateBanner);
    app.delete("/api/banner/:id", [authJwt.verifyToken, authJwt.isAdmin],bannerController.deleteBanner);
};