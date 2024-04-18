const express = require('express');
const controller = require('../controllers/counter');
const { validateId, extractIdFromToken } = require('../middlewares/validators');
const app = express();

app.patch('/update/:id', [validateId, extractIdFromToken], controller.update);

app.post('/create', [extractIdFromToken], controller.create);

app.get('/get', [extractIdFromToken], controller.get);

app.get('/getById/:id', [validateId, extractIdFromToken], controller.getById);

app.delete('/delete/:id', [validateId, extractIdFromToken], controller.delete);

module.exports = app;