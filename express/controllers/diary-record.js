const CommentRecord = require("../../mongoose/models/CommentRecord");
const Counter = require("../../mongoose/models/Counter");
const { validateCounterId, validateDate, validateComment } = require("../middlewares/express-validator/relapse");
const { validationResult } = require("express-validator");

const controller = {};

/**
 * Create Diary Record
 *
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.token - The authentication token
 * @param {Object} req.body - Request body
 * @param {string} req.body.counterId - ID of the associated counter
 * @param {string} req.body.date - Date of the diary record (ISO Date String)
 * @param {string} [req.body.comment] - Optional comment for the diary record
 * @param {Object} res - Express response object
 * @param {Object} res.body - Created diary record object
 * @returns {void}
 */
controller.create = async (req, res) => {
    //#region Validation
    validateCounterId(req, res, () => { });
    validateDate(req, res, () => { });
    if (req.body.comment) validateComment(req, res, () => { });
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    //#endregion

    const counter = await Counter.findById(req.body.counterId);
    if (!counter) {
        res.sendStatus(404);
        return;
    }
    const commentRecord = await CommentRecord.create({ date: req.body.date, comment: req.body.comment });
    counter.diary.records.push(commentRecord._id);
    counter.save();
    res.status(201).json(commentRecord);
};

/**
 * Delete Diary Record
 *
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.token - The authentication token
 * @param {string} req.params.id - ID of the diary record to delete
 * @param {Object} res - Express response object
 * @returns {void}
 */
controller.delete = async (req, res) => {
    const counter = await Counter.findById(req.body.counterId);
    if (!counter) {
        res.sendStatus(404);
        return;
    }
    const index = counter.diary.records.indexOf(res.locals.id);
    if (index !== -1) {
        counter.diary.records.splice(index, 1);
        counter.save();
    }
    CommentRecord.deleteOne({ _id: res.locals.id });
    res.sendStatus(200);
};

/**
 * Update Diary Record
 *
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.token - The authentication token
 * @param {string} req.params.id - ID of the diary record to update
 * @param {Object} req.body - Request body
 * @param {string} [req.body.date] - Updated date for the diary record (optional)
 * @param {string} [req.body.comment] - Updated comment for the diary record (optional)
 * @param {Object} res - Express response object
 * @param {Object} res.body - Updated diary record object
 * @returns {void}
 */
controller.update = (req, res) => {
    //#region Validation
    if (req.body.date) validateDate(req, res, () => { })
    if (req.body.comment) validateComment(req, res, () => { })
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    //#endregion

    CommentRecord.updateOne({ _id: res.locals.id }, req.body).then(
        async () => {
            const record = await CommentRecord.findById(res.locals.id);
            res.status(200).json(record);
        },
        (err) => {
            res.status(400).json({ message: err });
        }
    )
};

module.exports = controller;