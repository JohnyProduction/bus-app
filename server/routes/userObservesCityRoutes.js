const express = require('express');
const router = express.Router();
const userObservesCityController = require('../controllers/userObservesCityController');

router.get('/:id', userObservesCityController.getObservationById);
router.get('/', userObservesCityController.getAllObservations);
router.post('/', userObservesCityController.addObservation);
router.put('/:id', userObservesCityController.updateObservation);
router.delete('/:id', userObservesCityController.deleteObservation);

module.exports = router;
