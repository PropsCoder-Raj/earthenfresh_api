const mongoose = require("mongoose");

const Banner = mongoose.model(
  "settings",
  new mongoose.Schema({
    storeId: {type:String},
    publicToken: {type:String},
    privateToken: {type:String},
    key: {type:String},
    secret: {type:String},
    referLimit: {type:Number},
    minAmount: {type:Number},
    amount: {type:Number},
    maximumOrderSubtotal: {type:Number},
    minimumOrderSubtotal: {type:Number},
  })
);

module.exports = Banner;