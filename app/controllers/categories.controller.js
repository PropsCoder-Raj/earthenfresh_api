const rp = require("request-promise")
const storeConfig = require("../config/store.config");

exports.getAllCategories = (req, res) => {
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/categories?token=' + storeConfig.publicTokenId).then(data => {
        let categories = JSON.parse(data);

        if (categories['items'].length > 0) {
            res.status(200).send({
                status: "success",
                message: "Get " + categories['count'] + " Category Records!",
                data: categories['items']
            });
        } else {
            res.status(200).send({
                status: "success",
                message: "No Records!",
            });
        }
    })
};



exports.getSingle = (req, res) => {
    // let cId = req.params.categoryid;
    let cId = req.query.categoryid;
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/categories/' + cId + '?token=' + storeConfig.publicTokenId).then(data => {
        let categories = JSON.parse(data);
        res.status(200).send({
            status: "success",
            message: "Get Category Records!",
            data: categories
        });
    }).catch((err) => {
        res.status(400).send({ status: "error", message: err.message });
    })
};