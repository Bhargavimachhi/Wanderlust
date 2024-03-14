const express=require("express");
const app=express.Router({mergeParams : true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const listSchema = require("../utils/listValidation.js");
const { isLoggedin } = require("../middlewares.js");

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

app.get("/",wrapAsync(async (req,res)=>{
    let lists=await Listing.find();
    res.render("index.ejs",{lists});
}))

app.get("/new",isLoggedin,wrapAsync(async (req,res)=>{
    res.render("new.ejs");
}))

app.post("/new",isLoggedin,wrapAsync(async (req,res,next)=>{
    let {error}= listSchema.validate(req.body);
    if(error){
        req.flash("error","Invalid data Entered");
        res.redirect("/listings/new");
    }
    else{
        let {price,location,title,image,description}=req.body
        let listing=new Listing({price:price,description:description,title:title,image:image,location:location,author:req.user.username});
        await listing.save();
        req.flash("success","Listing created");
        res.redirect("/listings");
    }
}))

app.get("/:id",wrapAsync(async (req,res)=>{
    try{
        let {id}=req.params;
        let data=await Listing.findById(id);
        let reviews=[];
        for(let curr of data.review){
            let d=await Review.findById(curr);
            reviews.push(d);
        }
        res.render("view.ejs",{list : data , reviews});
    }
    catch(err){
        req.flash("error","Id doesn't Exist");
        res.redirect("/listings");
    }
}))

app.get("/:id/edit",isLoggedin,wrapAsync(async(req,res)=>{

    try{
        let {id}=req.params;
        let data=await Listing.findById(id);

        if(req.user.username === data.author){
            res.render("edit.ejs",{list :data});
        }
        else{
            req.flash("error","You don't have permission to access");
            res.redirect("/listings");
        }
    }
    catch(err){
        req.flash("error","Id doesn't Exist");
        res.redirect("/listings");
    }
}))

app.patch("/:id",isLoggedin,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let {error}= listSchema.validate(req.body);
    if(error){
        req.flash("error","Invalid data Entered");
        res.redirect(`/listings/${id}/edit`);
    }
    else{
        try{
            let data=await Listing.findById(id)
            if(data.author === req.user.username){
                await Listing.findByIdAndUpdate(id,req.body);
                req.flash("success","Listing Updated");
                res.redirect("/listings");
            }
            else{
                req.flash("error","You don't have permission to access");
                res.redirect("/listings");
            }
        }
        catch(err){
            req.flash("error","Id doesn't Exist");
            res.redirect(`/listings/${id}/edit`);
        }
    }
}))

app.get("/:id/delete",isLoggedin,wrapAsync(async (req,res)=>{
    try{
        let {id}=req.params;
        let curr=await Listing.findById(id);
        if(curr.author === req.user.username){
            let data=await Listing.findByIdAndDelete(id,req.body);
            await Review.deleteMany({_id : {$in : data.review}});
            req.flash("success","Listing Deleted");
            res.redirect("/listings");
        }
        else{
            req.flash("error","You don't have permission to access");
            res.redirect("/listings");
        }
    }
    catch(err){
        req.flash("error","Listing Couldn't Deleted");
        res.redirect("/listings");
    }
}))

module.exports=app;
