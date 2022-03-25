const db = require("../models");
const Fcmtokens = db.fcmtokens;
const User = db.user;

exports.getAllFcmtokens = (req,res)=>{
    Fcmtokens.find({},(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: err });
        } else {
          res.status(200).send({
              status:"success",
              message : "All FCM Tokens",
              data: data
          });
        }
    });
}

exports.getSingleFcmtokens = (req,res)=>{
    Fcmtokens.find({_id:req.params.id},(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: err });
        } else {
          res.status(200).send({
              status:"success",
              message : "Fcmtokens",
              data: data
          });
        }
    });
}


exports.getUsersFcmtokens = (req,res)=>{// Validate request
    if (!req.params.cid) {
        res.status(400).send({ message: "User Id Required" });
        return;
    }

    User.findById(req.params.cid, (err, userData) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            // res.status(500).send({ status: "success", message: userData});
            Fcmtokens.find({ user: userData }, (err, fmcTokensData) => {
                if (err) {
                    res.status(500).send({ status: "error", message: err });
                } else {
                    res.status(200).send({ status: "success", data: fmcTokensData });
                }
            });
        }
    });
}

exports.createFcmtokens = (req, res) => {
    User.findById(req.body.userId, (err, userData) => {
        if (userData) {
            const fcmtokens = new Fcmtokens({
                token: req.body.token,
                user: userData
            });
            fcmtokens.save((err, data) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
        
                res.status(200).send({
                    status:"success",
                    message : "Fcmtokens Created Successful"
                });
            });
        }
    });        
};

exports.updateFcmtokens = (req,res)=>{
  Fcmtokens.findByIdAndUpdate(req.params.id,{$set:{token: req.body.token }},(err,data)=>{
    if(err){
      res.status(500).send({ status:"error", message: err });
    } else {
      res.status(200).send({
          status:"success",
          message : "Banner updated successfully"
      });
    }
  });
}


exports.deleteFcmtokens = (req,res)=>{
  Fcmtokens.findByIdAndRemove(req.params.id,(err,data)=>{
    if(err){
      res.status(500).send({ status:"error", message: err });
    } else {
      res.status(200).send({
          status:"success",
          message : "Banner Deleted successfully"
      });
    }
  });
}
