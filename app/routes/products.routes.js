const productsController = require("../controllers/products.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/products/all", productsController.getAllProducts);
  app.get("/api/products", productsController.getAllCategorywiseProducts);
  app.get("/api/single-product", productsController.getSingleProduct);
};