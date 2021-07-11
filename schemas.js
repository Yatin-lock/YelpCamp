const sanitizeHtml = require('express-mongo-sanitize');
const BaseJoi = require('joi');

const extension = joi =>({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHtml':'{{#label}} should not include HTML'
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean = sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(clean!=value){
                    return helpers.error('string.escapeHtml',{value});
                }
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    deletedImages: Joi.array()
});
module.exports.reviewSchema = Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().min(0).max(5).required()
})