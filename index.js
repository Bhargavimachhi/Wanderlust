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
    next();
})

app.use("/listings/:id/review",reviewRouter);
app.use("/listings",listRouter);

app.get("/",(req,res)=>{
    res.render("temp.ejs");
})

app.get("*",(req,res)=>{
    res.render("error.ejs",{code : 404,msg:"Page Not Found",description:""});
})

app.use((err,req,res,next)=>{
    res.render("error.ejs",{code : 500,msg:"Internal Server Error",description:err.message});
})