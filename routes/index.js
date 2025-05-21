const route = require('express').Router();
const userRoutes = require('./userRoutes');

route.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Kosan API'
    });
});

route.use('/user', userRoutes);

module.exports = route;