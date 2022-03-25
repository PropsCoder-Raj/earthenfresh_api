const db = require("../models");
const Ratings = db.ratings;
const User = db.user;

exports.getSingleRatings = (req, res) => {
    Ratings.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({
                status: "success",
                message: "Ratings",
                data: data
            });
        }
    });
}


exports.getRatingsOrderId = (req, res) => {
    Ratings.find({ orderId : req.params.id }, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({
                status: "success",
                message: "Ratings",
                data: data
            });
        }
    });
}

exports.getRatingsProcutWise = (req, res) => {
    Ratings.find({ productId : req.params.id }, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({
                status: "success",
                message: "Ratings",
                data: data
            });
        }
    });
}

exports.createRatings = (req, res) => {

    User.findOne({ _id: req.params.id }, (err, userData) => {

        if (err || userData === null) {
            res.status(500).send({ status: "error", message: err });
            return;
        }

        const ratings = new Ratings({
            rating: req.body.rating,
            productId: req.body.productId,
            customerId: req.body.customerId,
            orderId: req.body.orderId,
            user: userData
        });
        ratings.save((err, data) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.status(200).send({
                status: "success",
                message: "Ratings Created Successful"
            });
        });

    });
};

exports.updateRatings = (req, res) => {
    Ratings.findByIdAndUpdate(req.params.id, {
        $set:
        {
            rating: req.body.rating,
        }
    },
        (err, data) => {
            if (err) {
                res.status(500).send({ status: "error", message: err });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Rat updated successfully"
                });
            }
        });
}
