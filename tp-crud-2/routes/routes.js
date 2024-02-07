const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");

// image upload
var storage = multer.diskStorage({
    destination: function(request, file, cb){
        cb(null, "./uploads");
    },
    filename: function(request, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
});

var upload = multer({
    storage: storage,
}).single("image");

// insert an user into database
router.post("/add", upload, async function(request, response){
    const user = new User({
        name: request.body.name,
        email: request.body.email,
        phone: request.body.phone,
        image: request.file.filename,
    });
    try {
        await user.save();
        request.session.message = {
            type: "success",
            message: "User added successfully!"
        };
        response.redirect("/");
    } catch (error) {
        response.json({
            message: error.message,
            type: "danger"
        });
    }
});

router.get("/", async function(request, response){
    try {
        const users = await User.find().exec();
        response.render("index", {
            title: "Home Page",
            users: users
        });
    } catch (error) {
        response.json({
            message: error.message
        });
    }
});

router.get("/add", function(request, response){
    response.render("add_users", {
        title: "Add Users"
    });
});

module.exports = router;