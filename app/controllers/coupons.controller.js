const rp = require("request-promise")
const storeConfig = require("../config/store.config");


exports.getSingleCoupons = (req, res) => {
    let couponsId = req.query.couponsId;
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/discount_coupons/' + couponsId + '?token=' + storeConfig.secretTokenId).then(data => {
        let Coupons = JSON.parse(data);
        res.status(200).send({
            status: "success",
            message: "Get Coupons Records!",
            data: Coupons
        });
    }).catch((err) => {
        res.status(200).send({ status: "error", message: err.message });
    })
};