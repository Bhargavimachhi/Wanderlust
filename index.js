const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const port=8000;
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");

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

app.get("/listings",async (req,res)=>{
    console.log("/listings");
    let lists=await Listing.find();
    res.render("index.ejs",{lists});
})

app.get("/listings/new",async (req,res)=>{
    console.log("/listings/new");
    res.render("new.ejs");
})

app.post("/listings/new",async (req,res)=>{
    console.log("/listings/bew post");

    let listing=new Listing(req.body);
    await listing.save();
    res.redirect("/listings");
})

app.get("/listings/:id",async (req,res)=>{
    console.log("/listings/id");

    let {id}=req.params;
    let data=await Listing.findById(id);
    res.render("view.ejs",{list :data});
})

app.get("/listings/:id/edit",async(req,res)=>{
    console.log("/listings/id/edit");

    let {id}=req.params;
    let data=await Listing.findById(id);
    res.render("edit.ejs",{list : data});
})

app.patch("/listings/:id",async (req,res)=>{
    console.log("/listings/id patch");

    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body);
    let lists=await Listing.find({});
    res.render("index.ejs",{lists});
})

app.get("/listings/:id/delete",async (req,res)=>{
    console.log("/listings/id delete");

    let {id}=req.params;
    await Listing.findByIdAndDelete(id,req.body);
    let lists=await Listing.find({});
    res.render("index.ejs",{lists});
})