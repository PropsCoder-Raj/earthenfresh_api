const db = require("../models");
const Usersnotifications = db.usersnotifications;
const User = db.user;

exports.getAllUsersnotifications = (req,res)=>{
    Usersnotifications.find({},(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: err });
        } else {
          res.status(200).send({
              status:"success",
              message : "All Usersnotifications",
              data: data
          });
        }
    });
}

exports.getSingleUsersnotifications = (req,res)=>{
    Usersnotifications.find({_id:req.params.id},(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: err });
        } else {
          res.status(200).send({
              status:"success",
              message : "Usersnotifications",
              data: data
          });
        }
    });
}


exports.getUsersUsersnotifications = (req,res)=>{// Validate request
    if (!req.params.cid) {
        res.status(400).send({ message: "User Id Required" });
        return;
    }

    User.findById(req.params.cid, (err, userData) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            // res.status(500).send({ status: "success", message: userData});
            Usersnotifications.find({ user: userData }, (err, fmcTokensData) => {
                if (err) {
                    res.status(500).send({ status: "error", message: err });
                } else {
                    res.status(200).send({ status: "success", data: fmcTokensData });
                }
            });
        }
    });
}

exports.createUsersnotifications = (req, res) => {
    User.findById(req.body.userId, (err, userData) => {
        if (userData) {
            const usersnotifications = new Usersnotifications({
                title: req.body.title,
                message: req.body.message,
                notification_id: req.body.id,
                user: userData,
                view_status: false
            });
            usersnotifications.save((err, data) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
        
                res.status(200).send({
                    status:"success",
                    message : "Usersnotifications Created Successful"
                });
            });
        }
    });        
};

exports.updateUsersnotifications = (req,res)=>{
  Usersnotifications.findByIdAndUpdate(req.params.id,{$set:{view_status: true}},(err,data)=>{
    if(err){
      res.status(500).send({ status:"error", message: err });
    } else {
      res.status(200).send({
          status:"success",
          message : "Usersnotifications updated successfully"
      });
    }
  });
}


exports.deleteUsersnotifications = (req,res)=>{
  Usersnotifications.findByIdAndRemove(req.params.id,(err,data)=>{
    if(err){
      res.status(500).send({ status:"error", message: err });
    } else {
      res.status(200).send({
          status:"success",
          message : "Usersnotifications Deleted successfully"
      });
    }
  });
}
