const customerController = require("../controllers/customer.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  

  app.get("/api/customer/refferal/:code", customerController.getReferralCode);
  app.get("/api/customer/all", customerController.getAllUsers);
  app.get("/api/customer/latest", customerController.getAllUsersLatest);
  app.get("/api/customer/info/:id", customerController.getCustomer);
  app.get("/api/customer/id/:cid", customerController.getCustomerUsingCustomerId);
  app.get("/api/customer/orders", customerController.getCustomerOrders);
  app.get("/api/customer/carts", customerController.getCustomerCarts);
  app.post("/api/customer/cart/:id", customerController.createCustomerCart);
  app.put("/api/customer/cart/:id", customerController.updateCustomerCart);
  app.put("/api/customer/update/:id", customerController.updateCustomer); 
  app.put("/api/customer/status/update/:id", customerController.updateCustomerStatus); 
  app.put("/api/customer/password/update/:id", customerController.changeUserPassword);   
  
  app.put("/api/balance/:id", customerController.updateBalance);
  app.put("/api/customer/referral/:id", customerController.updateCustomerReferralCode);
  app.put("/api/customer/referral-code/:id", customerController.updateCustomerCode);

  app.post("/api/address/:cid", customerController.createAddress);
  app.put("/api/address/:id", customerController.updateAddress);
  app.put("/api/address/default/:id/:cid", customerController.updateAddressDefault);
  app.get("/api/address/:cid", customerController.getAddress);
  app.delete("/api/address/:id/:cid", customerController.deleteAddress);
};

