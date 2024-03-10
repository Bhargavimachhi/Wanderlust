const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const port=8000;
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const listRouter =require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended :true}));
app.use(express.json());
app.use(methodOverride('_method'));

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