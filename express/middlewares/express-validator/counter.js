const { body, param } = require('express-validator');

const validateName = body('name')
    .trim()
    .isLength({ min: 1, max: 30 }).withMessage('Counter name must be between 1 and 30 characters');

const validateStart = body('start')
    .isISO8601().withMessage('Start must be a valid ISO date string')
    .custom((value) => {
        const now = new Date();
        const startDate = new Date(value);
        return startDate <= now;
    }).withMessage('Start date must be in the past or present');

const validateColor = body('color')
    .notEmpty().withMessage('Color must not be empty');

module.exports = {
    validateName,
    validateStart,
    validateColor
};
