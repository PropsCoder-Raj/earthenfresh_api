const db = require("../models");
const { course:Courses, module:Module, questionBank:QuestionBank, program:Program,user: User, role: Role} = db;
const fs = require('fs');
const path = require('path')
const formidable = require('formidable');
var request = require('request');
const storeConfig = require("../config/store.config");
const rp = require("request-promise")

var bcrypt = require("bcryptjs");

exports.getProfileInfo = (req, res) => {
    rp.get('https://app.ecwid.com/api/v3/' + storeConfig.storeId + '/profile/shippingOptions?token=' + storeConfig.secretTokenId).then(data => {
        let profile = JSON.parse(data);
        console.log(profile);
  
        if (profile.length > 0) {
            res.status(200).send({
                status: "success",
                data: profile[0]['destinationZone']
            });
        } else {
            res.status(200).send({
                status: "success",
                message: "No Records!",
            });
        }
    });
  };

exports.uploadFile = (req, res) => {
    const form = new formidable.IncomingForm({allowEmptyFiles:false,keepExtensions:true});
    form.parse(req, function(err, fields, files){
        if(fields.file !== ""){
            var oldPath = files.file.filepath;
            var newPath = path.join(__dirname, '../../uploads')
                    + '/'+files.file.newFilename
            var rawData = fs.readFileSync(oldPath)
        
            fs.writeFile(newPath, rawData, function(err){

                res.status(200).send({
                    status:"success",
                    message : "Successfully Uploaded",
                    data: {
                        url:files.file.newFilename
                    }
                });
            });
        } else {
            res.status(500).send({ status:"error", message: "File is Missing" });
        }
    });
};



exports.retrieveFile = (req, res, next) => {
    try{
        res.status(200).sendFile(path.join(__dirname, '../../uploads/'+req.params.file));
    }catch(error){
        res.status(500).send({ status:"error", message: "File is Missing" });
    }
}

exports.downloadCSVFile = (req, res, next) => {
    try{
        res.status(200).sendFile(path.join(__dirname, '../../uploads/'+req.params.file));
    }catch(error){
        res.status(500).send({ status:"error", message: "File is Missing" });
    }
}