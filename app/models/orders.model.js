const mongoose = require("mongoose");
const Orders = mongoose.model(
    "Orders",
    new mongoose.Schema({
        paymentStatus: { type: String },
        fulfillmentStatus: { type: String },
        customerId: { type: Number },
        discount: { type: Number },
        referralCode: { type: String },
        orderComments: { type: String },
        total: { type: Number },
        additionalInfo:
            {
                name: { type: String },
                street: { type: String },
                city: { type: String },
                countryCode: { type: String },
                postalCode: { type: String },
                phone: { type: String }
            },
        shippingPerson:
            {
                name: { type: String },
                street: { type: String },
                city: { type: String },
                countryCode: { type: String },
                postalCode: { type: String },
                phone: { type: String }
            },
        items: [
            {
                name: { type: String },
                productId: { type: Number },
                price: { type: Number },
                quantity: { type: Number }
            }
        ],
        orderId: { type: String },
    }, { timestamps: true })
);
module.exports = Orders;