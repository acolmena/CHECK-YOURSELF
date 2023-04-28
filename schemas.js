const Joi = require('joi')


module.exports.frameSchema = Joi.object({
    frame: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        words: Joi.string().required()
    }).required()
});
