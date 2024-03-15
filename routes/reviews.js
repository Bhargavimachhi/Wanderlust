const express=require("express");
const app=express.Router({mergeParams : true});
const {isLoggedin} = require("../middlewares.js");
const review = require("../controllers/review.js");

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

app.post("/",isLoggedin,wrapAsync(review.addReview))
app.get("/:rid",isLoggedin,wrapAsync(review.deleteReview));

module.exports=app;
