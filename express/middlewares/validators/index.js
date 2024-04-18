require('dotenv').config();
const { isValidObjectId } = require("mongoose");
const jwt = require('jsonwebtoken');
const User = require('../../../mongoose/models/User');
const TokenBlacklist = require('../../../mongoose/models/TokenBlacklist');

const validateId = (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ message: `Bad Request: Invalid id: ${id}` });
        return;
    }
    if (!isValidObjectId(id)) { //https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id
        res.status(400).json({ message: `Bad Request: Invalid id: ${id}` });
        return;
    }
    next();
}

const extractIdFromToken = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: `Missing auth token` });
        return;
    }
    token = token.replace('Bearer ', '').trim();
    let verify;
    try {
        verify = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        res.status(400).json({ message: `Bad auth token` });
        return;
    }
    const tokenIsBanned = await TokenBlacklist.findOne({ token: token });
    if (tokenIsBanned) {
        res.sendStatus(403);
        return;
    }

    const id = verify.sub;
    const found = await User.findById(id);
    if (!found) {
        res.status(400).json({ message: `Cannot find user linked to the token` });
        return;
    }
    res.locals = { id: id, token: token };

    next();
}

module.exports = { validateId, extractIdFromToken };
