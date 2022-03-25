const ordersController = require("../controllers/orders.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/order/invoices/:orderId/:customerId", [authJwt.verifyToken], ordersController.getOrderInvoices);
  app.get("/api/orders/:customerId", [authJwt.verifyToken], ordersController.getOrders);
  app.get("/api/order/:id", [authJwt.verifyToken], ordersController.getUserOrders);
  app.get("/api/order-single/:id", [authJwt.verifyToken], ordersController.getSingleOrders);
  app.get("/api/order-all", [authJwt.verifyToken], ordersController.getOrdersAll);
  app.get("/api/order-latest", [authJwt.verifyToken], ordersController.getAllOrdersLatest);
  app.post("/api/order", [authJwt.verifyToken], ordersController.createOrder);
};