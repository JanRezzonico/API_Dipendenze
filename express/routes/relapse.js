const express = require('express');
const controller = require('../controllers/relapse');
const { validateId, extractIdFromToken } = require('../middlewares/validators');
const app = express();

app.post('/create', [extractIdFromToken], controller.create);

app.delete('/delete/:id', [validateId, extractIdFromToken], controller.delete);

app.patch('/update/:id', [validateId, extractIdFromToken], controller.update);

module.exports = app;