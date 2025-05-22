const route = require('express').Router();
const userRoutes = require('./userRoutes');
const kosRoutes = require('./kosRoutes');
const facilitiesRoutes = require('./facilityRoutes');
const rentRoutes = require('./rentRoutes');

route.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Kosan API'
    });
});

route.use('/user', userRoutes);
route.use('/kos', kosRoutes);
route.use('/facility', facilitiesRoutes);
route.use('/rent', rentRoutes);

module.exports = route;