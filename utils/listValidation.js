const joi=require("joi");

const listSchema = joi.object({
    title : joi.string().required(),
    description : joi.string().required(),
    author : joi.string().required(),
    image : joi.object().required(),
    location : joi.string().required(),
    price : joi.number().required(),
});

module.exports=listSchema;