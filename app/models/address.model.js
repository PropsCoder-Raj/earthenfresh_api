const mongoose = require("mongoose");
const Address = mongoose.model(
  "Address",
  new mongoose.Schema({
    house_flat_floor_no: { type: String },
    apartment_road_area: { type: String },
    landmark: { type: String },
    city: { type: String },
    pincode: { type: Number },
    type: { type: String },
    default: { type: Boolean },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);
module.exports = Address;