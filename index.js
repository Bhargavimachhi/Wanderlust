const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const port=8000;
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended :true}));
app.use(express.json());
app.use(methodOverride('_method'));

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

app.get("/",async (req,res)=>{
    let lists=await Listing.find();
    res.render("index.ejs",{lists});
})