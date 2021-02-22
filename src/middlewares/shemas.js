// load Joi module
const Joi = require('joi');

// accepts name only as letters
const name = Joi.string().required();

const personDataSchema = Joi.object().keys({
    firstName: name,
    lastName: name,
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[^a-zA-Z\d\s:]/, 'Your password must be non-alphanumeric characters.').min(8).required(),
});


// export the schemas
module.exports = {
    '/signup': personDataSchema
};