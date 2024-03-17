const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const listSchema = require("../utils/listValidation.js");

module.exports.renderHomePage=async (req,res)=>{
    let lists=await Listing.find();
    res.render("index.ejs",{lists});
};

module.exports.renderNewListingPage=async (req,res)=>{
    res.render("new.ejs");
};

module.exports.addNewListing=async (req,res,next)=>{
    let obj={
        price:req.body.price,
        description:req.body.description,
        title:req.body.title,
        location:req.body.location,
        author:req.user.username,
        image : {
            url:req.file.path,
            filename:req.file.fiename,
        }
    }
    let {error}= listSchema.validate(obj);
    if(error){
        console.log(error);
        req.flash("error","Invalid data Entered");
        res.redirect("/listings/new");
    }
    else{
        let listing=new Listing(obj);
        listing.image.url=req.file.path,
        listing.image.filename=req.file.filename,
        await listing.save();
        req.flash("success","Listing created");
        res.redirect("/listings");
    }
};

module.exports.showListing=async (req,res)=>{
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
};

module.exports.renderEditPage=async(req,res)=>{

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
};

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    let obj={
        price:req.body.price,
        description:req.body.description,
        title:req.body.title,
        location:req.body.location,
        author:req.user.username,
        image : {
            url:req.file.path,
            filename:req.file.fiename,
        }
    }
    let {error}= listSchema.validate(obj);
    if(error){
        req.flash("error","Invalid data Entered");
        res.redirect(`/listings/${id}/edit`);
    }
    else{
        try{
            let data=await Listing.findById(id);
            if(data.author === req.user.username){
                await Listing.findByIdAndUpdate(id,obj);
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
};

module.exports.deleteListing=async (req,res)=>{
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
};

