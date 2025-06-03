const route = require('express').Router();
const KosControllers = require('../controllers/KosControllers');

route.get('/aaa', KosControllers.getAllKos);
route.post('/aaa', KosControllers.getAllKos);
// route.get('/:id', KosControllers.getKosById);

module.exports = route;