const ratingsController = require("../controllers/ratings.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/ratings/:id", [authJwt.verifyToken],ratingsController.getSingleRatings);
    app.get("/api/ratings/product/:id", [authJwt.verifyToken],ratingsController.getRatingsProcutWise);
    app.get("/api/ratings/order/:id", [authJwt.verifyToken],ratingsController.getRatingsOrderId);
    app.post("/api/ratings/:id", [authJwt.verifyToken],ratingsController.createRatings);
    app.put("/api/ratings/:id", [authJwt.verifyToken],ratingsController.updateRatings);
};