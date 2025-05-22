const route = require('express').Router();
const KosControllers = require('../controllers/KosControllers');

route.get('/', KosControllers.getAllKos);
route.get('/:id', KosControllers.getKosById);

module.exports = route;