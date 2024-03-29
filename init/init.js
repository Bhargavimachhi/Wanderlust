const mongoose=require("mongoose");
const temp=require("./source.js");
const Listing=require("../models/listing.js");

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(()=>{
    console.log("MongoDB connection successfull");
}).catch((err)=>{
    console.log("Failure");
});

let init= async ()=>{
    await Listing.deleteMany({});
    
    for(let data of temp){
        let l=new Listing(data);
        await l.save(); 
    }

    console.log("Data Inserted");
};

init();