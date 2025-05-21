const route = require('express').Router();
const FacilityControllers = require('../controllers/FacilityControllers');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

route.get('/', FacilityControllers.getAllFacilities);
route.post('/', authentication, authorization, FacilityControllers.addFacility);

module.exports = route;