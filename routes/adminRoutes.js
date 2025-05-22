const route = require('express').Router();
const FacilityControllers = require('../controllers/admin/FacilityControllers');
const KosControllers = require('../controllers/admin/KosControllers');
const RentControllers = require('../controllers/admin/RentControllers');
const UserControllers = require('../controllers/admin/UserControllers');

route.get('/user', UserControllers.getAllUsers);
route.delete('/user/:id', UserControllers.deleteUser);

route.post('/facility', FacilityControllers.addFacility);
route.get('/facility', FacilityControllers.getAllFacilities);
route.put('/facility/:id', FacilityControllers.updateFacility);
route.delete('/facility/:id', FacilityControllers.deleteFacility);

route.post('/kos', KosControllers.addKos);
route.get('/kos', KosControllers.getAllKos);
route.get('/kos/:id', KosControllers.getKosById);


route.get('/rent', RentControllers.getAllRent);
route.get('/rent/:id', RentControllers.getRentById);
route.put('/rent/:id', RentControllers.updateRent);

module.exports = route;