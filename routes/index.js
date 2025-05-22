const route = require('express').Router();
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const userRoutes = require('./userRoutes');
const kosRoutes = require('./kosRoutes');
const rentRoutes = require('./rentRoutes');
const adminRoutes = require('./adminRoutes');

route.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Kosan API'
    });
});

route.use('/user', userRoutes);
route.use('/kos', kosRoutes);
route.use('/rent', rentRoutes);
route.use('/admin', authentication, authorization, adminRoutes);

module.exports = route;