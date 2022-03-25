const mongoose = require("mongoose");

const Fcmtokens = mongoose.model(
  "Fcmtokens",
  new mongoose.Schema({
    token: {type:String},
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  }, { timestamps: true })
);

module.exports = Fcmtokens;