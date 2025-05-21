const route = require('express').Router();
const UserControllers = require('../controllers/UserControllers');

route.post('/register', UserControllers.userRegister);
route.post('/login', UserControllers.userLogin);

module.exports = route;