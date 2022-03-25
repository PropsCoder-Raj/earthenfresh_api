const mongoose = require("mongoose");
const Transaction = mongoose.model(
  "WalletTransaction",
  new mongoose.Schema({
    amount: { type: Number },
    type: { type: String }, // ReferEarn OR Products
    transactionType: { type: String }, // Credit OR Debit
    message: { type: String },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  }, { timestamps: true })
);
module.exports = Transaction;