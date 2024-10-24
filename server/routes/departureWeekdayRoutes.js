const express = require('express');
const router = express.Router();
const departureWeekdayController = require('../controllers/departureWeekdayController');

router.get('/:id', departureWeekdayController.getDepartureWeekdayById);
router.get('/', departureWeekdayController.getAllDepartureWeekdays);
router.post('/', departureWeekdayController.addDepartureWeekday);
router.put('/:id', departureWeekdayController.updateDepartureWeekday);
router.delete('/:id', departureWeekdayController.deleteDepartureWeekday);

module.exports = router;
