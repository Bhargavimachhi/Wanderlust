module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You need to Login First");
        let path=req.headers.referer;
        res.redirect(`${path}`);
    }
    else{
        next();
    }
}