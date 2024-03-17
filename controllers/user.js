const User=require("../models/user.js");
const userSchema=require("../utils/userValidation.js");

module.exports.signupUser=async (req,res)=>{
    let {error}= userSchema.validate(req.body);
    if(error){
        req.flash("error","Invalid data Entered");
        res.redirect("/listings");
    }
    else{
        let data =await User.find({email : req.body.email});
        let data2 =await User.find({username : req.body.username});
        if(data.length>0){
            req.flash("error","Email Already Exists");
            let path=req.headers.referer;
            res.redirect(`${path}`);
        }
        else if(data2.length>0){
            req.flash("error","Username Already Exists");
            let path=req.headers.referer;
            res.redirect(`${path}`);
        }
        else{
            let user=new User(req.body);
            await User.register(user,req.body.password);
            req.login(user,(err)=>{
                if(err){
                    req.flash("error","Something Went Wrong");
                    let path=req.headers.referer;
                    res.redirect(`${path}`);
                }
                else{
                    req.flash("success","Welcome To Wanderlust");
                    let path=req.headers.referer;
                    res.redirect(`${path}`);
                }
            })
        }
    }
};

module.exports.loginUser=async (req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    res.redirect(`${req.headers.referer}`);
};

module.exports.logoutUser=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successful");
        res.redirect("/listings");
    })
};
