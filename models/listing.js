const mongoose=require("mongoose");

let listSchema=new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type : String,
      required : true
    },
    image: {
      url:{
        type:String,
        required:true,
      },
      filename :{
        type : String,
        required:true,
      }
    },
    review : [{
      type : mongoose.Schema.Types.ObjectId,
      ref:'Review'
    }],
    author :{
      type:String,
      required:true
    },
    price: {
      type:Number,
      required:true,
    },
    location : {
      type:String,
      required:true
    },
});

const Listing=mongoose.model("Listing",listSchema);
module.exports=Listing;