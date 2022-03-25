const mongoose = require("mongoose");

const Usersnotifications = mongoose.model(
  "Usersnotifications",
  new mongoose.Schema({
    title:{type: String},
    message:{type: String},
    notification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    view_status: {type: Boolean}
  }, { timestamps: true })
);

module.exports = Usersnotifications;