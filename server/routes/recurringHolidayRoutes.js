const express = require('express');
const router = express.Router();
const recurringHolidayController = require('../controllers/recurringHolidayController');

router.get('/:id', recurringHolidayController.getRecurringHolidayById);
router.get('/', recurringHolidayController.getAllRecurringHolidays);
router.post('/', recurringHolidayController.addRecurringHoliday);
router.put('/:id', recurringHolidayController.updateRecurringHoliday);
router.delete('/:id', recurringHolidayController.deleteRecurringHoliday);

module.exports = router;
