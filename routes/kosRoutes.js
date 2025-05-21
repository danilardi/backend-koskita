const route = require('express').Router();
const KosControllers = require('../controllers/KosControllers');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

route.post('/', authentication, authorization, KosControllers.addKos);
route.get('/', KosControllers.getAllKos);

module.exports = route;