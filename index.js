const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const port=8000;
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const flash=require("connect-flash");
const session=require("express-session")
const listRouter =require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const validationRouter = require("./routes/validation.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended :true}));
app.use(express.json());
app.use(methodOverride('_method'));
const sessionOptions={
    secret :"sjwgjqwgdjgqwdjqdjqjwhdqgwje",
    resave : false,
    saveUninitialized:true,
    cookie:{
        expires :Date.now()+7*24*60*60*1000,
        maxAge :7*24*60*60*1000,
        httpOnly:true,
    },
};
app.use(session(sessionOptions));
app.use(flash()); 
app.engine("ejs",ejsMate);
app.use(passport.initialize());
app.use(passport.session());

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(()=>{
    console.log("MongoDB connection successfull");
}).catch((err)=>{
    console.log("Failure");
});

app.listen(port,()=>{
    console.log("Server Started");
});

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.user=req.user;
    next();
})

app.use("/listings/:id/review",reviewRouter);
app.use("/listings",listRouter);
app.use("/",validationRouter);

app.get("*",(req,res)=>{
    req.flash("error","Page Not Found")
    res.redirect("/listings");
})

app.use((err,req,res,next)=>{
    req.flash("error",err.message)
    res.redirect("/listings");
})