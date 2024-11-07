const express = require('express');
const router = express.Router();
const departureTimeController = require('../controllers/departureTimeController');


router.get('/:id', departureTimeController.getTimeById);
router.get('/', departureTimeController.getAllTimes);
router.post('/', departureTimeController.addTime);
router.put('/:id', departureTimeController.updateTime);
router.delete('/:id', departureTimeController.deleteTime);

module.exports = router;
