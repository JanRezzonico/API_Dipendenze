require('dotenv').config();
const User = require("../../mongoose/models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { formatUser } = require('../helpers/user');
const { validateUsername, validatePassword, validateName, validateLanguage } = require('../middlewares/express-validator/user');
const { validationResult } = require('express-validator');
const TokenBlacklist = require('../../mongoose/models/TokenBlacklist');

const controller = {};

/**
 * Sign up a new user
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.username - The user's
 * @param {string} req.body.password - The user's password
 * @param {string} req.body.name - The user's name
 * @param {string} req.body.language - The user's preferred language
 * @param {Object} res - Express response object
 * @param {string} res.body.token - The JWT token for the newly created user
 * @param {string} res.body.username - The user's username
 * @param {string} res.body.name - The user's name
 * @param {string} res.body.language - The user's preferred language
 * @returns {void}
 */
controller.signup = async (req, res) => {
    //#region Validation
    await Promise.all(
        [
            validateUsername(req, res, () => { }),
            validatePassword(req, res, () => { }),
            validateName(req, res, () => { }),
            validateLanguage(req, res, () => { })
        ]
    );
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() });
        return;
    }
    //#endregion

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const duplicate = await User.findOne({ username: req.body.username });
    if (duplicate) {
        res.status(400).json({ message: `User with username '${req.body.username}' already exists` });
        return;
    }

    const user = await User.create(
        {
            username: req.body.username,
            password: hashedPassword,
            name: req.body.name,
            language: req.body.language
        }
    );

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET);
    res.status(201).json(formatUser(user, token));
};

/**
* Log in an existing user
*
* @param {Object} req - Express request object
* @param {string} req.body.username - The user's username
* @param {string} req.body.password - The user's password
* @param {Object} res - Express response object
* @param {string} res.body.token - The JWT token for the logged-in user
* @param {string} res.body.username - The user's username
* @param {string} res.body.name - The user's name
* @param {string} res.body.language - The user's preferred language
* @returns {void}
*/
controller.login = async (req, res) => {
    //#region Validation
    await Promise.all(
        [
            validateUsername(req, res, () => { }),
            validatePassword(req, res, () => { })
        ]
    );
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() });
        return;
    }
    //#endregion

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        res.status(400).json({ message: `User with username '${req.body.username}' does not exists` });
        return;
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
        res.status(400).json({ message: `Incorrect password` });
        return;
    }

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET);
    res.status(201).json(formatUser(user, token));
};

/**
* Log out a user
*
* @param {Object} req - Express request object
* @param {string} req.header.token - The JWT token for the logged-in user
* @param {Object} res - Express response object
* @returns {void}
*/
controller.logout = (req, res) => {
    TokenBlacklist.create({ token: res.locals.token }).then(
        () => {
            res.sendStatus(200);
        },
        (err) => {
            // Token is already blacklisted
            res.sendStatus(200);
        }
    )
};

/**
* Delete a user account
*
* @param {Object} req - Express request object
* @param {string} req.header.token - The JWT token for the logged-in user
* @param {Object} res - Express response object
* @returns {void}
*/
controller.delete = (req, res) => {
    User.deleteOne({ _id: res.locals.id }).then(
        () => {
            res.sendStatus(200);
        },
        (err) => {
            res.status(400).json({ message: err });
        }
    )
};

/**
* Update user information
*
* @param {Object} req - Express request object
* @param {string} req.header.token - The JWT token for the logged-in user
* @param {string} [req.body.username] - The user's new username (optional)
* @param {string} [req.body.password] - The user's new password (optional)
* @param {string} [req.body.name] - The user's new name (optional)
* @param {string} [req.body.language] - The user's new preferred language (optional)
* @param {Object} res - Express response object
* @param {string} res.body.username - The user's updated username
* @param {string} res.body.name - The user's updated name
* @param {string} res.body.language - The user's updated preferred language
* @returns {void}
*/
controller.update = async (req, res) => {
    //#region Validation
    await Promise.all(
        [
            req.body.username ? validateUsername(req, res, () => { }) : () => { },
            req.body.password ? validatePassword(req, res, () => { }) : () => { },
            req.body.name ? validateName(req, res, () => { }) : () => { },
            req.body.language ? validateLanguage(req, res, () => { }) : () => { }
        ]
    );
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() });
        return;
    }
    //#endregion

    if (req.body.password) {
        const saltRounds = 10;
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }
    User.updateOne({ _id: res.locals.id }, req.body).then(
        async () => {
            const user = await User.findById(res.locals.id);
            res.status(200).json(formatUser(user));
        },
        (err) => {
            res.status(400).json({ message: err });
        }
    )
};

module.exports = controller;