const express = require('express');
const controller = require('../controllers/user');
const { extractIdFromToken } = require('../middlewares/validators');
const app = express();

app.post('/signup', [], controller.signup);

app.post('/login', [], controller.login);

app.post('/logout', [extractIdFromToken], controller.logout);

app.delete('/delete', [extractIdFromToken], controller.delete);

app.patch('/update', [extractIdFromToken], controller.update);

module.exports = app;