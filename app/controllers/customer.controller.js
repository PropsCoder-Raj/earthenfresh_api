const rp = require("request-promise")
const storeConfig = require("../config/store.config");
const authConfig = require("../config/auth.config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;
const Role = db.role;
const Address = db.address;


// Get All Latest
exports.getAllUsersLatest = (req, res) => {
    var startOfToday = new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000)));
    Role.find({ name: { $in: "user" } }, (err, roles) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        } else {
            User.find({ createdAt: { $gte: startOfToday } }, (err, data) => {
                if (err) {
                    res.status(500).send({ status: "error", message: "Role must not be Empty" });
                } else {
                    res.status(200).send({
                        status: "success",
                        message: "All Users retrieved",
                        count: data.length,
                        data: data
                    });
                }
            });
        }
    });
}


// Get Referral Code
exports.getReferralCode = (req, res) => {

    User.find({ code: req.params.code }, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: "Role must not be Empty" });
        } else {
            res.status(200).send({
                status: "success",
                message: "Referral Code Found",
                count: data.length,
                data: data
            });
        }
    });
}

// Get All Users
exports.getAllUsers = (req, res) => {

    Role.find({ name: { $in: "user" } }, (err, roles) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        } else {
            User.find({ roles: { $in: roles[0]._id } }, (err, data) => {
                if (err) {
                    res.status(500).send({ status: "error", message: "Role must not be Empty" });
                } else {
                    res.status(200).send({
                        status: "success",
                        message: "All Users retrieved",
                        count: data.length,
                        data: data
                    });
                }
            });
        }
    });
}

// Get Customer Orders
exports.getCustomerOrders = (req, res) => {

    let customerId = req.query.customerId;
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/orders?token=' + storeConfig.secretTokenId + '&customerId=' + customerId).then(data => {
        let orders = JSON.parse(data);

        if (orders['items'].length > 0) {
            res.status(200).send({
                status: "success",
                message: "Get " + orders['count'] + " Orders Records!",
                data: orders['items']
            });
        } else {
            res.status(200).send({
                status: "success",
                message: "No Records!",
            });
        }
    }).catch(err => {
        res.status(400).send({ status: "error", message: err });
    })
};


// Get Customer Carts
exports.getCustomerCarts = (req, res) => {

    let customerId = req.query.customerId;
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/carts?token=' + storeConfig.secretTokenId + '&customerId=' + customerId).then(data => {
        let carts = JSON.parse(data);

        if (carts['items'].length > 0) {
            res.status(200).send({
                status: "success",
                message: "Get " + carts['count'] + " Carts Records!",
                data: carts['items']
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


// Post Customer Create Cart
exports.createCustomerCart = (req, res) => {
    console.log("Welocome");
    var options = {
        method: 'POST',
        uri: 'https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/order/calculate?token=' + storeConfig.secretTokenId,
        body: {
            customerId: Number(req.params.id),
            items: req.body.items
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options)
        .then(function (parsedBody) {
            res.status(200).send({ status: "success", message: "Successfully Customer Cart Created" });
        })
        .catch(function (err) {
            res.status(500).send({ status: "error", message: err });
        });
};

// Post Customer Update Cart
exports.updateCustomerCart = (req, res) => {
    var options = {
        method: 'POST',
        uri: 'https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/carts/' + req.params.id + '?token=' + storeConfig.secretTokenId,
        body: {
            hidden: req.body.hidden,
            taxesOnShipping: [{
                name: req.body.name,
                value: req.body.value,
                total: req.body.total
            }]
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options)
        .then(function (parsedBody) {
            res.status(200).send({ status: "success", message: "Successfully Customer Cart Updated" });
        })
        .catch(function (err) {
            res.status(500).send({ status: "error", message: err });
        });
};


// Get getCustomer
exports.getCustomer = (req, res) => {
    User.findById(req.params.id, (err, userData) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({ status: "success", data: userData });
        }
    });
}

// Get getCustomerUsingCustomerId
exports.getCustomerUsingCustomerId = (req, res) => {
    const query = User.where({ customerId: req.params.cid });
    query.findOne(function (err, userData) {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({ status: "success", data: userData });
        }
    });
}


// Put updateReferral Code
exports.updateCustomerReferralCode = (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        $set:
        {
            referralCodeApply: true
        }
    }, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({
                status: "success",
                message: "User updated successfully",
            });
        }
    });
}


// Put Code
exports.updateCustomerCode = (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        $set:
        {
            code: req.body.code
        }
    }, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({
                status: "success",
                message: "User updated successfully",
            });
        }
    });
}

// Put updateCustomer
exports.updateCustomer = (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        $set:
        {
            email: req.body.email,
            fullname: req.body.fullname,
            phone: req.body.phone,
        }
    }, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({
                status: "success",
                message: "User updated successfully",
            });
        }
    });
}

// Put updateCustomerStatus
exports.updateCustomerStatus = (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        $set:
        {
            status: req.body.status
        }
    }, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({
                status: "success",
                message: "User status updated successfully",
            });
        }
    });
}

// Put updateBalance
exports.updateBalance = (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        $set:
        {
            balance: req.body.balance,
        }
    }, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({
                status: "success",
                message: "Balance updated successfully",
            });
        }
    });
}


// Get Address
exports.getAddress = (req, res) => {
    // Validate request
    if (!req.params.cid) {
        res.status(400).send({ message: "User Id Required" });
        return;
    }

    User.findById(req.params.cid, (err, userData) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            // res.status(500).send({ status: "success", message: userData});
            Address.find({ user: userData }, (err, addressData) => {
                if (err) {
                    res.status(500).send({ status: "error", message: err });
                } else {
                    res.status(200).send({ status: "success", data: addressData });
                }
            });
        }
    });
}

// Post Address Create
exports.createAddress = (req, res) => {

    let count = 0;
    // Validate request
    if (!req.params.cid) {
        res.status(400).send({ message: "User Id Required" });
        return;
    }

    let myPromise = new Promise(function (myResolve, myReject) {
        User.findById(req.params.cid, (err, userData) => {
            if (userData) {
                Address.find({ user: userData }, (err, addressData) => {
                    if (addressData.length > 0) {
                        addressData.forEach((element, index, array) => {
                            Address.findByIdAndUpdate(element['_id'], {
                                $set:
                                {
                                    default: false
                                }
                            }, (err, data) => {
                                if (data) {
                                    console.log("Address updated successfully");
                                }
                            });

                            if (index == array.length - 1) myResolve();
                        })
                    } else {
                        myResolve();
                    }
                });
            }
        });
    });

    myPromise.then(function (value) {
        User.findById(req.params.cid, (err, customerData) => {
            if (err) {
                res.status(500).send({ status: "error", message: err });
            } else {
                const address = new Address({
                    house_flat_floor_no: req.body.house_flat_floor_no,
                    apartment_road_area: req.body.apartment_road_area,
                    landmark: req.body.landmark,
                    city: req.body.city,
                    pincode: req.body.pincode,
                    type: req.body.type,
                    default: true,
                    user: customerData
                });
                address.save(address).then(data => {
                    res.status(200).send({ status: "success", message: "Add Address Successfully" });
                }).catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the address."
                    });
                });
            }
        });
    })

}

// Put Address Update
exports.updateAddressDefault = (req, res) => {
    // Validate request
    if (!req.params.id && !req.params.cid) {
        res.status(400).send({ message: "Address Id and Customer Id Required" });
        return;
    }

    User.findById(req.params.cid, (err, userData) => {
        if (userData) {
            Address.find({ user: userData }, (err, addressData) => {
                if (addressData) {
                    addressData.forEach(element => {
                        if (element['_id'] == req.params.id) {
                            Address.findByIdAndUpdate(element['_id'], {
                                $set:
                                {
                                    default: true
                                }
                            }, (err, data) => {
                                if (data) {
                                    console.log("Address updated successfully true" + element['_id']);
                                }
                            });
                        } else {
                            Address.findByIdAndUpdate(element['_id'], {
                                $set:
                                {
                                    default: false
                                }
                            }, (err, data) => {
                                if (data) {
                                    console.log("Address updated successfully false" + element['_id']);
                                }
                            });
                        }
                    })
                }
            });
        }
    });
}


// Put Address Update
exports.updateAddress = (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({ message: "Address Id Required" });
        return;
    }

    Address.findByIdAndUpdate(req.params.id, {
        $set:
        {
            house_flat_floor_no: req.body.house_flat_floor_no,
            apartment_road_area: req.body.apartment_road_area,
            landmark: req.body.landmark,
            city: req.body.city,
            pincode: req.body.pincode,
            type: req.body.type
        }
    }, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            res.status(200).send({
                status: "success",
                message: "Address updated successfully"
            });
        }
    });
}

// Delete Address Update
exports.deleteAddress = (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({ message: "Address Id Required" });
        return;
    }

    Address.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
        } else {
            User.findById(req.params.cid, (err, userData) => {
                if (userData) {
                    Address.find({ user: userData }, (err, addressData) => {
                        if (addressData.length > 0) {
                            let addressDefaultCount = 0;
                            let myPromise = new Promise(function (myResolve, myReject) {
                                addressData.forEach((element, index, array) => {
                                    if(element['default'] == true){
                                        addressDefaultCount++;
                                    }

                                    if(index == array.length - 1) myResolve()
                                });
                            }); 
                            myPromise.then(function (value) {
                                if(addressDefaultCount == 0){
                                    Address.findByIdAndUpdate(addressData[0]['_id'], {
                                        $set:
                                        {
                                            default: true
                                        }
                                    }, (err, data) => {
                                        if (data) {
                                            res.status(200).send({
                                                status: "success",
                                                message: "Address Deleted successfully"
                                            });
                                            console.log("Address updated successfully true");
                                        }
                                    });
                                }else{
                                    res.status(200).send({
                                        status: "success",
                                        message: "Address Deleted successfully"
                                    });
                                }
                            });
                        }else{
                            res.status(200).send({
                                status: "success",
                                message: "Address Deleted successfully"
                            });
                        }
                    });
                }
            });
        }
    });
}


exports.changeUserPassword = (req, res) => {

    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.status(500).send({ status: "error", message: err });
            return;
        }

        let passwordIsValid = bcrypt.compareSync(
            req.body.currentPassword,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(200).send({
                status: "error",
                message: "Invalid Current Password!",
            });
        }

        User.findByIdAndUpdate(req.params.id, { $set: { password: bcrypt.hashSync(req.body.newPassword, 8) } }, (err, data) => {
            if (err) {
                res.status(500).send({ status: "error", message: err });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Password changed successfully"
                });
            }
        });

    });

}