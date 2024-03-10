const express=require("express");
const app=express.Router({mergeParams : true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const reviewSchema = require("../utils/reviewValidation.js");

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

app.post("/",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    console.log(req.body);
    if(!data){
        res.render("error.ejs",{code : 400,msg:"Bad Request",description:"Id you entered doesn't exist enter Valid Id"});
    }
    else{
        let {error}= reviewSchema.validate(req.body);
        if(error){
            console.log(error.message);
            res.render("error.ejs",{code : 400,msg:"Bad Request",description:error.message});
        }
        else{
            let newReview=new Review(req.body);
            data.review.push(newReview);
            await data.save();
            await newReview.save();
            res.redirect(`/listings/${id}`);
        }
    }
}))

app.get("/:rid",wrapAsync(async (req,res)=>{
    let {id,rid}=req.params;
    console.log(id,rid);
    let list=await Listing.findById(id);
    let review=await Review.findById(rid);
    if(!list || !review){
        res.render("error.ejs",{code : 400,msg:"Bad Request",description:"List or Review doesn't exist"});
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
        res.redirect(`/listings/${id}`);
    }
}));

module.exports=app;
