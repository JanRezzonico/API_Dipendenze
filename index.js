require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

if (!process.env.DATABASE_URL || !process.env.PORT) {
    console.log("Please make sure to have a .env file with all the required options")
    return;
}

mongoose.connect(process.env.DATABASE_URL);
const database = mongoose.connection;

database.on('error', (error) => {
    console.error(error);
});

database.once('connected', () => {
    console.log('Database Connected');
    if (process.env.RESET_DB === 'true') {
        console.log("DB reset");

        //We drop everything in the database, not the database itself
        database.dropDatabase();
    }
});

const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Middleware to handle illegal JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err.message);
        return res.status(400).send({ message: 'Illegal JSON' });
    }
    next();
});

app.use('/api/user', require('./express/routes/user'));
app.use('/api/counter', require('./express/routes/counter'));
app.use('/api/diary-record', require('./express/routes/diary-record'));
app.use('/api/relapse', require('./express/routes/relapse'));
app.use('/api/check', require('./express/routes/check'));
app.use('/api/check-username-availability', require('./express/routes/check-username-availability'));

app.listen(process.env.PORT, () => {
    console.log(`Server Started on port ${process.env.PORT}`);
});