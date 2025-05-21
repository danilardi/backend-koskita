const route = require('express').Router();
const UserControllers = require('../controllers/UserControllers');
const authentication = require('../middlewares/authentication');

route.post('/register', UserControllers.userRegister);
route.post('/login', UserControllers.userLogin);
route.get('/profile', authentication, UserControllers.getProfile);

module.exports = route;