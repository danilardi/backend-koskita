const route = require('express').Router();

route.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Kosan API'
    });
});

module.exports = route;