const joi=require("joi");

const reviewSchema = joi.object({
    comment : joi.string().required(),
    rating : joi.number().required().max(5).min(1)
});

module.exports=reviewSchema;