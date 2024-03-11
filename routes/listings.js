const express=require("express");
const app=express.Router({mergeParams : true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const listSchema = require("../utils/listValidation.js");


function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

app.get("/",wrapAsync(async (req,res)=>{
    let lists=await Listing.find();
    res.render("index.ejs",{lists});
}))

app.get("/new",wrapAsync(async (req,res)=>{
    res.render("new.ejs");
}))

app.post("/new",wrapAsync(async (req,res,next)=>{
    let {error}= listSchema.validate(req.body);
    if(error){
        req.flash("error","Invalid data Entered");
        res.redirect("/listings/new");
    }
    else{
        let listing=new Listing(req.body);
        await listing.save();
        req.flash("success","Listing created");
        res.redirect("/listings");
    }
}))

app.get("/:id",wrapAsync(async (req,res)=>{
    try{
        let {id}=req.params;
        let data=await Listing.findById(id);
        res.render("view.ejs",{list :data});
    }
    catch(err){
        req.flash("error","Id doesn't Exist");
        res.redirect("/listings");
    }
}))

app.get("/:id/edit",wrapAsync(async(req,res)=>{
    try{
        let {id}=req.params;
        let data=await Listing.findById(id);
        res.render("edit.ejs",{list :data});
    }
    catch(err){
        req.flash("error","Id doesn't Exist");
        res.redirect("/listings");
    }
}))

app.patch("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let {error}= listSchema.validate(req.body);
    if(error){
        req.flash("error","Invalid data Entered");
        res.redirect(`/listings/${id}/edit`);
    }
    else{
        try{
            await Listing.findByIdAndUpdate(id,req.body);
            req.flash("success","Listing Updated");
            res.redirect("/listings");
        }
        catch(err){
            req.flash("error","Id doesn't Exist");
            res.redirect(`/listings/${id}/edit`);
        }
    }
}))

app.get("/:id/delete",wrapAsync(async (req,res)=>{
    try{
        let {id}=req.params;
        let data = await Listing.findByIdAndDelete(id,req.body);
        await Review.deleteMany({_id : {$in : data.review}});
        req.flash("success","Listing Deleted");
        res.redirect("/listings");
    }
    catch(err){
        req.flash("error","Listing Couldn't Deleted");
        res.redirect("/listings");
    }
}))

module.exports=app;
