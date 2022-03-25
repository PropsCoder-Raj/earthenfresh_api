const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullname: {type:String},
    email: {type:String},
    // password: {type:String},
    uid:{type:String},
    phone: {type:Number},
    dob: {type:String},
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    gender: {type:String},
    status:{type:Number},
    lastLoginOn:{type:Date},
    createdAt:{type:Date},
    balance: {type: Number},
    code: {type: String},
    customerId: {type: Number},
    referralCodeApply: {type: Boolean}
  }, { timestamps: true })
);

module.exports = User;
