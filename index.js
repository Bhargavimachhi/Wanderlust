const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const port=8000;
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");
const listSchema = require("./utils/listValidation.js");

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

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

app.listen(port,()=>{
    console.log("Server Started");
});

app.get("/listings",wrapAsync(async (req,res)=>{
    let lists=await Listing.find();
    res.render("index.ejs",{lists});
}))

app.get("/listings/new",wrapAsync(async (req,res)=>{
    res.render("new.ejs");
}))

app.post("/listings/new",wrapAsync(async (req,res,next)=>{
    let {error}= listSchema.validate(req.body);
    if(error){
        res.render("error.ejs",{code : 400,msg:"Bad Request",description:"Enter Valid Data"});
    }
    else{
        let listing=new Listing(req.body);
        await listing.save();
        res.redirect("/listings");
    }
}))

app.get("/listings/:id",wrapAsync(async (req,res)=>{
    try{
        let {id}=req.params;
        let data=await Listing.findById(id);
        res.render("view.ejs",{list :data});
    }
    catch(err){
        res.render("error.ejs",{code : 400,msg : "Bad Request",description:"Id you entered doesn't exist enter Valid Id"});
    }
}))

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    try{
        let {id}=req.params;
        let data=await Listing.findById(id);
        res.render("edit.ejs",{list :data});
    }
    catch(err){
        res.render("error.ejs",{code : 400,msg : "Bad Request",description:"Id you entered doesn't exist enter Valid Id"});
    }
}))

app.patch("/listings/:id",wrapAsync(async (req,res)=>{
    let {error}= listSchema.validate(req.body);
    if(error){
        res.render("error.ejs",{code : 400,msg:"Bad Request",description:"Enter Valid Data"});
    }
    else{
        try{
            let {id}=req.params;
            await Listing.findByIdAndUpdate(id,req.body);
            let lists=await Listing.find({});
            res.render("index.ejs",{lists});
        }
        catch(err){
            res.render("error.ejs",{code : 400,msg : "Bad Request",description:"Id you entered doesn't exist enter Valid Id"});
        }
    }
}))

app.get("/listings/:id/delete",wrapAsync(async (req,res)=>{
    try{
        let {id}=req.params;
        await Listing.findByIdAndDelete(id,req.body);
        let lists=await Listing.find({});
        res.render("index.ejs",{lists});
    }
    catch(err){
        res.render("error.ejs",{code : 400,msg : "Bad Request",description:"Id you entered doesn't exist enter Valid Id"});
    }
}))

app.get("*",(req,res)=>{
    res.render("error.ejs",{code : 404,msg:"Page Not Found",description:""});
})

app.use((err,req,res,next)=>{
    res.render("error.ejs",{code : 500,msg:"Internal Server Error",description:""});
})