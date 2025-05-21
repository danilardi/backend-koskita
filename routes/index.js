const route = require('express').Router();
const userRoutes = require('./userRoutes');
const kosRoutes = require('./kosRoutes');

route.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Kosan API'
    });
});

route.use('/user', userRoutes);
route.use('/kos', kosRoutes);

module.exports = route;