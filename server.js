const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./earthenfresh-5c635-firebase-adminsdk-9md2a-b2ccbbf6ce.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Role = db.role;


db.mongoose.connect(`mongodb+srv://${dbConfig.HOST}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  Origin: "http://localhost:*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


require('./app/routes/categories.routes')(app);
require('./app/routes/products.routes')(app);
require('./app/routes/customer.routes')(app);
require('./app/routes/orders.routes')(app);
require('./app/routes/coupons.routes')(app);
require('./app/routes/banner.routes')(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/comman.routes')(app); 
require('./app/routes/notification.routes')(app);
require('./app/routes/settings.routes')(app);
require('./app/routes/transaction.routes')(app);

require('./app/routes/ratings.routes')(app);
require('./app/routes/fcmtokens.routes')(app);
require('./app/routes/usersnotifications.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}