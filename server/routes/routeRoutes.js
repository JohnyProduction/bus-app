const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.get('/:id', routeController.getRouteById);
router.get('/', routeController.getAllRoutes);
router.post('/', routeController.addRoute);
router.put('/:id', routeController.updateRoute);
router.delete('/:id', routeController.deleteRoute);

module.exports = router;