const rp = require("request-promise")
const storeConfig = require("../config/store.config");

exports.getAllProducts = (req, res) => {
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/products?token=' + storeConfig.publicTokenId +'&enabled=true').then(data => {
        let products = JSON.parse(data);

        if (products['items'].length > 0) {
            res.status(200).send({
                status: "success",
                message: "Get " + products['count'] + " Products Records!",
                data: products['items']
            });
        } else {
            res.status(200).send({
                status: "success",
                message: "No Records!",
            });
        }
    });
};

exports.getAllCategorywiseProducts = (req, res) => {
    let category_id = req.query.categoryid;
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/products?token=' + storeConfig.publicTokenId + '&category=' + category_id).then(data => {
        let products = JSON.parse(data);

        if (products['items'].length > 0) {
            res.status(200).send({
                status: "success",
                message: "Get " + products['count'] + " Products Records!",
                data: products['items']
            });
        } else {
            res.status(200).send({
                status: "success",
                message: "No Records!",
            });
        }
    }).catch(err => {
        res.status(400).send({ status: "error", message: err });
    });
};


exports.getSingleProduct = (req, res) => {
    let productId = req.query.productId;
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/products/' + productId + '?token=' + storeConfig.publicTokenId).then(data => {
        let products = JSON.parse(data);

        if (products['Id'] !== '') {
            res.status(200).send({
                status: "success",
                message: "Get Single Product Records!",
                data: products
            });
        } else {
            res.status(200).send({
                status: "success",
                message: "No Records!",
            });
        }
    }).catch(err => {
        res.status(400).send({ status: "error", message: err });
    });
};