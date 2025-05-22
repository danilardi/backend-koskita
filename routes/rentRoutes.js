const route = require('express').Router();
const RentControllers = require('../controllers/RentControllers');
const authentication = require('../middlewares/authentication');

route.post('/', authentication, RentControllers.rentKamar);
route.get('/self', authentication, RentControllers.getOwnRent);
route.get('/:id', authentication, RentControllers.getRentById);

module.exports = route;