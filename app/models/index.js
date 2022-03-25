const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;


db.banner = require("./banner.model");
db.address = require("./address.model");
db.user = require("./user.model");
db.role = require("./role.model");
db.refreshToken = require("./refreshtoken.model");
db.notification = require("./notification.model");
db.settings = require("./settings.model");
db.orders = require("./orders.model");
db.transaction = require("./transaction.model");
db.ratings = require("./ratings.model");
db.fcmtokens = require("./fcmtokens.model");
db.usersnotifications = require("./usersnotifications.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;