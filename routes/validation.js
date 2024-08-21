const express=require("express");
const app=express.Router({mergeParams : true});
const passport=require("passport");
const validation=require("../controllers/user");

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

app.post("/signup",wrapAsync(validation.signupUser));

app.post("/login",
    passport.authenticate("local",{
        failureRedirect:"/listings",
        failureFlash: {
            type: 'error',
            message: 'Invalid email and/ or password.'
        },
    }),
    wrapAsync(validation.loginUser));

app.get("/logout",validation.logoutUser);

module.exports=app;