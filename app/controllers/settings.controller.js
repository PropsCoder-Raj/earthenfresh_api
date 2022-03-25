const db = require("../models");
const { settings: Settings} = db;



exports.getSettings = (req,res)=>{
    Settings.find({},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Settings retrieved",
                data: data[0]
            });
        }
    });
}

exports.saveEcwid = (req, res) => {
    Settings.findByIdAndUpdate(req.params.id,{$set:{storeId: req.body.storeId,publicToken: req.body.publicToken,privateToken: req.body.privateToken}},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Ecwid Settings Updated"
            });
        }
    });
};

exports.saveRazorpay = (req, res) => {
    Settings.findByIdAndUpdate(req.params.id,{$set:{key: req.body.key,secret: req.body.secret}},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Razorpay Settings Updated"
            });
        }
    });
};

exports.saveRefer = (req, res) => {
    Settings.findByIdAndUpdate(req.params.id,{$set:{referLimit: req.body.referLimit,minAmount: req.body.minAmount,amount:req.body.amount}},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Referral Settings Updated"
            });
        }
    });
};

exports.saveCartcheckout = (req, res) => {
    Settings.findByIdAndUpdate(req.params.id,{$set:{maximumOrderSubtotal: req.body.maximumOrderSubtotal,minimumOrderSubtotal: req.body.minimumOrderSubtotal}},(err,data)=>{
        if(err){
            res.status(500).send({ status:"error", message: err });
        } else {
            res.status(200).send({
                status:"success",
                message : "Cart & Checout Settings Updated"
            });
        }
    });
};