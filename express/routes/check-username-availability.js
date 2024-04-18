const express = require('express');
const User = require('../../mongoose/models/User');
const app = express();

app.get('/', async (req, res) => {
    const user = (await User.findOne({username: req.query.username}));
    res.send({ unique: !user });
});

module.exports = app;