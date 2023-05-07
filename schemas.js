const baseJoi = require('joi');
// Package that helps to strip away the html / script tags that might be injected via forms
const sanitizeHtml = require('sanitize-html');

// Define an extension on joi.string() called 'escapeHTML' that checks to see if there are any html / script tags in forms
// Returns an error if there are (uses sanitize-html package imported above)
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                // If cleaned value not same as initial value, there must be some HTML tags!
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// Tell Joi to use extension defined above
const Joi = baseJoi.extend(extension);

// A JOI schema for a new review! Validates data before we attempt to save to MongoDB
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        title: Joi.string().required().max(285).escapeHTML(),
        author: Joi.string().required().max(100).escapeHTML(),
        // images: Joi.string().required(),
        rating: Joi.number().required().min(0).max(10),
        heading: Joi.string().required().max(285).escapeHTML(),
        text: Joi.string().required().max(2000).escapeHTML()
    }).required()
});

// JOI schema for a new comment
module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        text: Joi.string().required().max(1000).escapeHTML()
    }).required()
});