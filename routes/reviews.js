const express=require("express");
const app=express.Router({mergeParams : true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const reviewSchema = require("../utils/reviewValidation.js");
const {isLoggedin} = require("../middlewares.js");

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

app.post("/",isLoggedin,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    if(!data){
        req.flash("error","Id doesn't Exist");
        res.redirect("/listings");
    }
    else{
        let {error}= reviewSchema.validate(req.body);
        if(error){
            req.flash("error","Invalid data Entered");
            res.redirect(`/listings/${id}`);
        }
        else{
            let newReview=new Review(req.body);
            data.review.push(newReview);
            await data.save();
            await newReview.save();
            req.flash("success","Review Added");
            res.redirect(`/listings/${id}`);
        }
    }
}))

app.get("/:rid",isLoggedin,wrapAsync(async (req,res)=>{
    let {id,rid}=req.params;
    let list=await Listing.findById(id);
    let review=await Review.findById(rid);
    if(!list || !review){
        req.flash("error","Listing or Review Doesn't Exist");
        res.redirect(`/listings/${id}`);
    }
    else{
        for(let i=0;i<list.review.length;i++){
            if(list.review[i]._id == rid){
                list.review.splice(i,i+1);
                await list.save();
                break;
            }
        }
        await Review.findByIdAndDelete({_id : rid});
        req.flash("success","Review Deleted");
        res.redirect(`/listings/${id}`);
    }
}));

module.exports=app;
