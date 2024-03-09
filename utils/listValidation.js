const joi=require("joi");

const listSchema = joi.object({
    title : joi.string().required(),
    description : joi.string().required(),
    location : joi.string().required(),
    price : joi.number().required(),
    image : joi.string().allow("",null)
});

module.exports=listSchema;