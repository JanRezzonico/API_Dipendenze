const { validationResult } = require("express-validator");
const Counter = require("../../mongoose/models/Counter");
const { validateName, validateStart, validateColor } = require("../middlewares/express-validator/counter");

const controller = {};

/**
 * Create Counter
 *
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.token - The authentication token
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Name for the new counter
 * @param {string} req.body.start - Start date for the new counter
 * @param {string} req.body.color - Color for the new counter
 * @param {Object} res - Express response object
 * @param {Object} res.body - Newly created counter object
 * @returns {void}
 */
controller.create = async (req, res) => {
    //#region Validation
    validateName(req, res, () => { });
    validateStart(req, res, () => { });
    validateColor(req, res, () => { });
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    //#endregion

    Counter.create({ user: res.locals.id, ...req.body }).then(
        (data) => {
            res.status(200).json(data);
        },
        (err) => {
            res.sendStatus(400);
        }
    )
};

/**
 * Get Counters
 *
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.token - The authentication token
 * @param {Object} res - Express response object
 * @param {Object[]} res.body - Array of counter objects
 * @returns {void}
 */
controller.get = (req, res) => {
    Counter.find({ user: res.locals.id })
        .populate('resets')
        .populate('diary')
        .populate('diary.records').then(
            (data) => {
                res.status(200).json(data);
            },
            (err) => {
                res.sendStatus(400);
            }
        )
};
/**
 * Get Counter by id
 *
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.token - The authentication token
 * @param {Object} res - Express response object
 * @param {Object[]} res.body - Array of counter objects
 * @returns {void}
 */
controller.getById = (req, res) => {
    Counter.findById(req.params.id)
        .populate('resets')
        .populate('diary')
        .populate('diary.records')
        .then(
            (counter) => {
                if (!counter) {
                    res.sendStatus(404);
                    return;
                }
                res.status(200).json(counter);
            },
            (err) => {
                res.status(400).json({ message: err });
            }
        )
};

/**
 * Update Counter
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the counter to update
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.token - The authentication token
 * @param {Object} req.body - Request body
 * @param {string} [req.body.name] - New name for the counter (optional)
 * @param {string} [req.body.start] - New start date for the counter (optional)
 * @param {string} [req.body.color] - New color for the counter (optional)
 * @param {Object} res - Express response object
 * @param {Object} res.body - Updated counter object
 * @returns {void}
 */
controller.update = async (req, res) => {
    //#region Validation
    if (req.body.name) validateName(req, res, () => { });
    if (req.body.start) validateStart(req, res, () => { });
    if (req.body.color) validateColor(req, res, () => { });
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    //#endregion

    Counter.updateOne({ _id: req.params.id }, req.body).then(
        async () => {
            const counter = await Counter.findById(req.params.id);
            res.status(200).json(counter);
        },
        (err) => {
            res.status(400).json({ message: err });
        }
    )
};

/**
 * Delete Counter Record
 *
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.token - The authentication token
 * @param {string} req.params.id - ID of the counter record to delete
 * @param {Object} res - Express response object
 * @returns {void}
 */
controller.delete = async (req, res) => {
    await Counter.deleteOne({ _id: req.params.id });
    res.sendStatus(204);
};

module.exports = controller;