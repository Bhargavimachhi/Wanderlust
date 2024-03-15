const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const reviewSchema = require("../utils/reviewValidation.js");
const {isLoggedin} = require("../middlewares.js");

module.exports.addReview=async (req,res)=>{
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
            let {comment,rating}=req.body;
            let newReview=new Review({rating : rating ,comment: comment, author : req.user.username});
            data.review.push(newReview);
            await data.save();
            await newReview.save();
            req.flash("success","Review Added");
            res.redirect(`/listings/${id}`);
        }
    }
};

module.exports.deleteReview=async (req,res)=>{
    let {id,rid}=req.params;
    let list=await Listing.findById(id);
    let review=await Review.findById(rid);
    if(!list || !review){
        req.flash("error","Listing or Review Doesn't Exist");
        res.redirect(`/listings/${id}`);
    }
    else{
        let data=await Review.findById(rid);
        if(data.author === req.user.username){
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
        else{
            req.flash("error","You don't have permission to access");
            res.redirect("/listings");
        }
    }
};