const mongoose = require("mongoose");

const Notification = mongoose.model(
    "notification",
    new mongoose.Schema({
      title:{type: String},
      message:{type: String}
    }, { timestamps: true })
);


module.exports = Notification;