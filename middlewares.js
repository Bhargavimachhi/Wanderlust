module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You need to Login First");
        res.redirect("/listings");
    }
    else{
        next();
    }
}