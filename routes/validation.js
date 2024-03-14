const express=require("express");
const app=express.Router({mergeParams : true});
const User=require("../models/user.js");
const userSchema=require("../utils/userValidation.js");
const passport=require("passport");

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

app.post("/signup",wrapAsync(async (req,res)=>{
    let {error}= userSchema.validate(req.body);
    if(error){
        req.flash("error","Invalid data Entered");
        res.redirect("/signup");
    }
    else{
        let data =await User.find({email : req.body.email});
        let data2 =await User.find({username : req.body.username});
        if(data.length>0 || data2.length>0){
            req.flash("error","User Already Exists");
            res.redirect("/signup");
        }
        else{
            let user=new User(req.body);
            await User.register(user,req.body.password);
            req.login(user,(err)=>{
                if(err){
                    next(err);
                }
                req.flash("success","Welcome To Wanderlust");
                res.redirect("/listings");
            })
        }
    }
}));

app.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(async (req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    res.redirect("/listings");
}));

app.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successful");
        res.redirect("/listings");
    })
});

module.exports=app;