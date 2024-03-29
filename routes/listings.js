const express=require("express");
const app=express.Router({mergeParams : true});
const { isLoggedin } = require("../middlewares.js");
const listing = require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

//Index Route
app.get("/",wrapAsync(listing.renderHomePage));

//New Route
app.get("/new",isLoggedin,wrapAsync(listing.renderNewListingPage));
app.post("/new",isLoggedin,upload.single("image"),wrapAsync(listing.addNewListing));

//Show Route
app.get("/:id",wrapAsync(listing.showListing));

//Edit Route
app.get("/:id/edit",isLoggedin,wrapAsync(listing.renderEditPage));
app.patch("/:id",isLoggedin,upload.single("image"),wrapAsync(listing.editListing));

//Delete Route
app.get("/:id/delete",isLoggedin,wrapAsync(listing.deleteListing));

module.exports=app;
