const express = require('express');
const app = express();

// Connectivity test route
app.get('/', (req, res) => {
    res.send({ message: 'API connectivity test passed', status: true });
});

module.exports = app;