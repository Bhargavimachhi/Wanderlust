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
        res.render("error.ejs",{code : 400,msg:"Bad Request",description:error.message});
    }
    else{
        let listing=new Listing(req.body);
        await listing.save();
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
        res.render("error.ejs",{code : 400,msg : "Bad Request",description:err.message});
    }
}))

app.get("/:id/edit",wrapAsync(async(req,res)=>{
    try{
        let {id}=req.params;
        let data=await Listing.findById(id);
        res.render("edit.ejs",{list :data});
    }
    catch(err){
        res.render("error.ejs",{code : 400,msg : "Bad Request",description:err.message});
    }
}))

app.patch("/:id",wrapAsync(async (req,res)=>{
    let {error}= listSchema.validate(req.body);
    if(error){
        res.render("error.ejs",{code : 400,msg:"Bad Request",description:error.message});
    }
    else{
        try{
            let {id}=req.params;
            await Listing.findByIdAndUpdate(id,req.body);
            let lists=await Listing.find({});
            res.render("index.ejs",{lists});
        }
        catch(err){
            res.render("error.ejs",{code : 400,msg : "Bad Request",description:err.message});
        }
    }
}))

app.get("/:id/delete",wrapAsync(async (req,res)=>{
    try{
        let {id}=req.params;
        let data = await Listing.findByIdAndDelete(id,req.body);
        await Review.deleteMany({_id : {$in : data.review}});
        let lists=await Listing.find({});
        res.render("index.ejs",{lists});
    }
    catch(err){
        res.render("error.ejs",{code : 400,msg : "Bad Request",description:err.message});
    }
}))

module.exports=app;
