const mongoose = require("mongoose");
const Ratings = mongoose.model(
    "Ratings",
    new mongoose.Schema({
        rating: { type: Number },
        productId : { type: Number },
        customerId : { type: Number },
        orderId : { type: String },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
    }, { timestamps: true })
);
module.exports = Ratings;