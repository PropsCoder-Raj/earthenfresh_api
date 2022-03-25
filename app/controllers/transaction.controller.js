const db = require("../models");
const Transaction = db.transaction;
const User = db.user;
const Orders = db.orders;

exports.getAllTransaction = (req,res)=>{
    Transaction.find({},(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: err });
        } else {
          res.status(200).send({
              status:"success",
              message : "All Transaction",
              data: data
          });
        }
    });
}

exports.getUserReferralTransaction = (req,res)=>{

    User.findById(req.params.cid, (err, customerData) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            Transaction.find({user: customerData, type: "referral"},(err,data)=>{
                if(err){
                res.status(500).send({ status:"error", message: err });
                } else {
                res.status(200).send({
                    status:"success",
                    message : "Transaction",
                    count: data.length,
                    data: data
                });
                }
            });
        }
    });       
}

exports.getSingleTransaction = (req,res)=>{

    User.findById(req.params.cid, (err, customerData) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            Transaction.find({user: customerData},(err,data)=>{
                if(err){
                res.status(500).send({ status:"error", message: err });
                } else {
                res.status(200).send({
                    status:"success",
                    message : "Transaction",
                    data: data
                });
                }
            }).sort({"createdAt": -1});
        }
    });       
}

exports.createTransaction = (req, res) => {
    // Validate request
    if (!req.params.cid) {
        res.status(400).send({ message: "User Id Required" });
        return;
    } 

    let usersArr = [];


    User.findById(req.params.cid, (err, customerData) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {

            this.usersArr = customerData;
            console.log(req.body);

            Orders.findById(req.body.orderId, (err, ordersData) => {
                if (err) {
                    res.status(500).send({ status: "error", message: err });
                } else {
                    const transaction = new Transaction({
                        amount: req.body.amount,
                        type: req.body.type,
                        transactionType: req.body.transactionType,
                        message: req.body.message,
                        orderId: ordersData,
                        user: customerData
                    });
                    transaction.save((err, data) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                
                        res.status(200).send({
                            status:"success",
                            message : "Transaction Created Successful",
                            data: data
                        });
                    });
                }
            });
        }
    });
};