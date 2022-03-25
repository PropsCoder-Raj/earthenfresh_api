const transactionController = require("../controllers/transaction.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/transaction", [authJwt.verifyToken],transactionController.getAllTransaction);
    app.get("/api/transaction/:cid", [authJwt.verifyToken],transactionController.getSingleTransaction );
    app.get("/api/transaction/referral/:cid", [authJwt.verifyToken],transactionController.getUserReferralTransaction );
    app.post("/api/transaction/:cid", [authJwt.verifyToken],transactionController.createTransaction);
};