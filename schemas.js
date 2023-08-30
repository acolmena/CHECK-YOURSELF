const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} cannot include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.frameSchema = Joi.object({
    frame: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().allow('').escapeHTML(),
        words: Joi.array().required(),
        color: Joi.string().required().escapeHTML()
    }).required()
});
