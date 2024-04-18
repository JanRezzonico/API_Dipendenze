const { body } = require('express-validator');

const validateUsername = body('username')
    .trim()
    .isLength({ min: 4, max: 20 }).withMessage('Username must be between 4 and 20 characters')
    .matches(/^[a-zA-Z0-9._]+$/).withMessage('Username can only contain alphanumeric characters, dots and underscore');

const validatePassword = body('password')
    .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number');

const validateName = body('name')
    .trim()
    .isLength({ min: 1, max: 20 }).withMessage('Name must be between 1 and 20 characters')
    .isAlpha('en-US', { ignore: ' ' }).withMessage('Name can only contain alphabetical characters and spaces');

const validateLanguage = body('language')
    .trim();

module.exports = {
    validateUsername,
    validatePassword,
    validateName,
    validateLanguage
};