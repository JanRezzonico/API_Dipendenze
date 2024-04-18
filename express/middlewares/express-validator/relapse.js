const { body, param } = require('express-validator');

const validateCounterId = body('counterId')
    .isMongoId().withMessage('CounterId must be a valid MongoDB ObjectId');

const validateDate = body('date')
    .isISO8601().withMessage('Date must be a valid ISO date string')
    .custom((value) => {
        const now = new Date();
        const inputDate = new Date(value);
        return inputDate <= now;
    }).withMessage('Date must be in the past or present');

const validateComment = body('comment')
    .trim()
    .isLength({ min: 0, max: 500 }).withMessage('Comment must be between 0 and 500 characters');

module.exports = {
    validateCounterId,
    validateDate,
    validateComment,
};
