const express = require('express');
const router = express.Router();
const routeStopController = require('../controllers/routeStopController');

router.get('/:id', routeStopController.getStopById);
router.get('/', routeStopController.getAllStops);
router.post('/', routeStopController.addStop);
router.put('/:id', routeStopController.updateStop);
router.delete('/:id', routeStopController.deleteStop);
router.get('/from-to', routeStopController.getAllStopsFromTo);

module.exports = router;
