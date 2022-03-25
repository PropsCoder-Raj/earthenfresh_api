const config = require("../config/auth.config");
const storeConfig = require("../config/store.config");
const rp = require("request-promise")
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

  var options = {
    method: 'POST',
    uri: 'https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/customers?token=' + storeConfig.secretTokenId,
    body: {
      email: req.body.email,
      billingPerson: { name: req.body.fullname }
    },
    json: true // Automatically stringifies the body to JSON
  };

  rp(options)
    .then(function (parsedBody) {
      const user = new User({
        email: req.body.email,
        fullname: req.body.fullname,
        phone: req.body.phone,
        customerGroupId: req.body.customerGroupId,
        customerId: parsedBody['id'],
        // password: bcrypt.hashSync(req.body.password, 8),
        uid: req.body.uid,
        balance: 0,
        code: req.body.code,
        status:1,
        referralCodeApply: false
      });
      user.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (req.body.roles) {
          Role.find({ name: { $in: req.body.roles } }, (err, roles) => {
            if (err) {
              res.status(500).send({ message: "Role must not be empty" });
              return;
            }

            user.roles = roles.map(role => role._id);
            user.save(async (err,data) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              let token = jwt.sign({ id: data.id }, config.secret, {
                expiresIn: config.jwtExpiration,
              });
        
              let refreshToken = await RefreshToken.createToken(data);

              res.send({ status:"success", message: "User was registered successfully!",data: {
                id: data._id,
                email: data.email,
                accessToken: token,
                refreshToken: refreshToken,
              }});
            });
          }
          );
        } else {
          Role.findOne({ name: "user" }, (err, role) => {
            if (err) {
              res.status(500).send({ message: "Role must not be empty" });
              return;
            }

            user.roles = [role._id];
            user.save(async (err,data) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              let token = jwt.sign({ id: data.id }, config.secret, {
                expiresIn: config.jwtExpiration,
              });
        
              let refreshToken = await RefreshToken.createToken(data);

              res.send({status:"success", message: "User was registered successfully!",data:{
                id: data._id,
                email: data.email,
                accessToken: token,
                refreshToken: refreshToken,
              } });
            });
          });
        }
      });
    }).catch((err) => {
      res.status(400).send({ status: "error", message: err });
    })
};

exports.signin = (req, res) => {

  if(req.body.credential == "" || req.body.credential == undefined){
    return res.status(401).send({
      accessToken: null,
      message: "Missing Data",
    });
  }

  if(req.body.role == "" || req.body.role == undefined){
    return res.status(401).send({
      accessToken: null,
      message: "Missing Data",
    });
  }

  User.findOne({uid: req.body.uid})
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(500).send({ status:"error", message: "Invalid Email or Password" });
      }

      // let passwordIsValid = bcrypt.compareSync(
      //   req.body.password,
      //   user.password
      // );

      // if (!passwordIsValid) {
      //   return res.status(500).send({
      //     accessToken: null,
      //     status: "error",
      //     message: "Invalid Password!",
      //   });
      // }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      let rl = req.body.role;
      if(!authorities.includes("ROLE_" + rl.toUpperCase())){
        return res.status(500).send({
          status:"error",
          accessToken: null,
          message: "Sorry! You don't have permission to access this portal",
        });
      }

      if(user.status != 1){
        return res.status(500).send({
          status:"error",
          accessToken: null,
          message: "Your account is locked. Please contact Administrator",
        });
      }

      User.findByIdAndUpdate(user._id,{$set:{lastLoginOn: new Date()}},(err,data)=>{
        if(err){
          console.log(err);
        } 
      });

      res.status(200).send({
        status:"success",
        message : "Login successfully",
        data: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          accessToken: token,
          refreshToken: refreshToken,
        }
      });
    });
};

exports.checkUserExists = (req, res) => {
  console.log(req.body);
  User.findOne({phone: req.body.phone}).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    console.log(user);
    if (user) {
      res.status(200).send({ status:"success", message: "User Registered",data: "registered" });
    } else {
      res.status(200).send({ status:"success", message: "User Not Registered",data: "new" });
    }
  });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
}; 