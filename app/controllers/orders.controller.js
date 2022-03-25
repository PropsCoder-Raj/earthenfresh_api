const rp = require("request-promise")
const storeConfig = require("../config/store.config");
const db = require("../models");
const Orders = db.orders;
const User = db.user;


// Create Orders
exports.createOrder = (req, res) => {
    let items = req.body.items;
    if(req.body.discount !== null && req.body.discount !== undefined && req.body.discount !== '' && req.body.discount !== 0 ){
        var options = {
            method: 'POST',
            uri: 'https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/orders?token=' + storeConfig.secretTokenId,
            body: {
                email: req.body.email,
                paymentStatus: req.body.paymentStatus,
                fulfillmentStatus: req.body.fulfillmentStatus,
                customerId: req.body.customerId,
                discount: req.body.discount,
                orderComments: req.body.orderComments,
                total: req.body.total,
                additionalInfo: req.body.additionalInfo,
                shippingPerson: req.body.shippingPerson,
                billingPerson: req.body.shippingPerson,
                items: items
            },
            json: true // Automatically stringifies the body to JSON
        };
        rp(options).then(function (parsedBody) {
            if (parsedBody.orderId !== '') {
                const orders = new Orders({
                    paymentStatus: req.body.paymentStatus,
                    fulfillmentStatus: req.body.fulfillmentStatus,
                    customerId: req.body.customerId,
                    discount: req.body.discount,
                    referralCode: req.body.referralCode,
                    orderComments: req.body.orderComments,
                    total: req.body.total,
                    additionalInfo: req.body.additionalInfo,
                    shippingPerson: req.body.shippingPerson,
                    items: items,
                    orderId: parsedBody.orderId
                });
                orders.save((err, data) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
            
                    res.status(200).send({
                        status: "success",
                        message: "Create Order "+ parsedBody.orderId +" ! ",
                        orderId: parsedBody.orderId,
                        data: parsedBody,
                        orderData: data
                    });
                });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "No Records!",
                });
            }
        }).catch(function (err) {
            res.status(400).send({ status: "error", message: err });
        });
    }else{
        var options = {
            method: 'POST',
            uri: 'https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/orders?token=' + storeConfig.secretTokenId,
            body: {
                email: req.body.email,
                paymentStatus: req.body.paymentStatus,
                fulfillmentStatus: req.body.fulfillmentStatus,
                customerId: req.body.customerId,
                orderComments: req.body.orderComments,
                total: req.body.total,
                additionalInfo: req.body.additionalInfo,
                shippingPerson: req.body.shippingPerson,
                billingPerson: req.body.shippingPerson,
                items: items
            },
            json: true // Automatically stringifies the body to JSON
        };
        rp(options).then(function (parsedBody) {
            if (parsedBody.orderId !== '') {
                const orders = new Orders({
                    paymentStatus: req.body.paymentStatus,
                    fulfillmentStatus: req.body.fulfillmentStatus,
                    customerId: req.body.customerId,
                    referralCode: req.body.referralCode,
                    orderComments: req.body.orderComments,
                    total: req.body.total,
                    additionalInfo: req.body.additionalInfo,
                    shippingPerson: req.body.shippingPerson,
                    items: items,
                    orderId: parsedBody.orderId
                });
                orders.save((err, data) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
            
                    res.status(200).send({
                        status: "success",
                        message: "Create Order "+ parsedBody.orderId +" ! ",
                        orderId: parsedBody.orderId,
                        data: parsedBody,
                        orderData: data
                    });
                });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "No Records!",
                });
            }
        }).catch(function (err) {
            res.status(400).send({ status: "error", message: err });
        });
    }
};

// Get All Latest
exports.getAllOrdersLatest = (req,res)=>{
    var now = new Date();
    var startOfToday = new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000)));
    Orders.find({createdAt : {$gte: startOfToday}} ,(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: err });
        } else {
          res.status(200).send({
              status:"success",
              message : "All Orders",
              count : data.length,
              data: data
          });
        }
    }).sort({"createdAt": -1});
  }

exports.getOrdersAll = (req,res)=>{
    Orders.find({},(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: err });
        } else {
          res.status(200).send({
              status:"success",
              message : "All Orders",
              count : data.length,
              data: data
          });
        }
    }).sort({"createdAt": -1});
}

// Get Orders Invoices
exports.getOrderInvoices = (req, res) => {
    let orderId = req.params.orderId;
    let customerId = req.params.customerId;
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/orders' + orderId + '/invoices?token=' + storeConfig.publicTokenId + '&customerId=' + customerId).then(data => {
        let Invoices = JSON.parse(data);

        if (Invoices['id'] !== '') {
            res.status(200).send({
                status: "success",
                message: "Get Invoices Records!",
                data: Invoices
            });
        } else {
            res.status(200).send({
                status: "success",
                message: "No Records!",
            });
        }
    }).catch(err => {
        res.status(400).send({ status: "error", message: err });
    });
};


// Get Order Customer
exports.getOrders = (req, res) => {
    let customerId = req.params.customerId;
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/orders?token=' + storeConfig.secretTokenId + '&customerId=' + customerId).then(data => {
        let orders = JSON.parse(data);
        if (orders['items'].length > 0) {
            res.status(200).send({
                status: "success",
                message: "Get " + orders['count'] + " Orders Records!",
                data: orders['items'],
                count: orders['count']
            });
        } else {
            res.status(200).send({
                status: "success",
                message: "No Records!",
                count: 0
            });
        }
    }).catch(err => {
        res.status(400).send({ status: "error", message: err });
    });
};

// Get Orders
exports.getUserOrders = (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({ message: "User Id Required" });
        return;
    }

    User.findById(req.params.id, (err, userData) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            // res.status(500).send({ status: "success", message: userData});
            Orders.find({ user: userData }, (err, OrdersData) => {
                if (err) {
                    res.status(500).send({ status: "error", message: err });
                } else {
                    res.status(200).send({ status: "success", data: OrdersData });
                }
            }).sort({"createdAt": 'desc'});
        }
    });
}

// Get Orders
exports.getSingleOrders = (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({ message: "Order Id Required" });
        return;
    }

    Orders.findById(req.params.id, (err, OrdersData) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({ status: "success", data: OrdersData });
        }
    });
}