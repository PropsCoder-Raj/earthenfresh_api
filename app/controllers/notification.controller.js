const db = require("../models");
const admin = require("firebase-admin");
const { notification: Notification, user: User, role: Role, fcmtokens: Fcmtokens, usersnotifications: Usersnotifications } = db;

exports.createNotification = (req, res) => {
    const notification = new Notification({
        title: req.body.title,
        message: req.body.message
    });

    var payload = {
        data: {
            title: req.body.title,
            body: req.body.message
        }
    };
    var options = {
        priority: 'high'
    }

    let myPromise = new Promise(function (myResolve, myReject) {
        Fcmtokens.find({}, (err, data) => {
            if (err) {
                res.status(500).send({ status: "error", message: err });
            } else {
                data.forEach((element, index, array) => {
                    admin.messaging().sendToDevice(element['token'], payload, options).then(data => {
                        console.log("Notification Data");
                        console.log(data);
                        if (index == array.length - 1) myResolve();
                    })
                })
            }
        });
    });
    myPromise.then(() => {
        notification.save((err, notifydata) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            Fcmtokens.find({}, (err, fmcdata) => {
                if (err) {
                    res.status(500).send({ status: "error", message: err });
                } else {
                    fmcdata.forEach(element=>{
                        User.findById(element['user'], (err, userData) => {
                            if (userData) {
                                const usersnotifications = new Usersnotifications({
                                    title: req.body.title,
                                    message: req.body.message,
                                    notification: notifydata,
                                    user: userData,
                                    view_status: false
                                });
                                usersnotifications.save((err, data) => {
                                    if (err) {
                                        res.status(500).send({ message: err });
                                        return;
                                    }

                                    console.log("Usersnotifications Created Successful");
                                });
                            }
                        });        
                    });
                }
            });

            res.status(200).send({
                status: "success",
                message: "Notification Created successfully!"
            });
        });
    });
};

exports.getAllNotification = (req, res) => {
    Notification.find({}, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({
                status: "success",
                message: "All Notification retrieved",
                data: data
            });
        }
    }).limit(50).sort({ "createdAt": -1 });
}

