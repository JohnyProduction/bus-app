const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');

router.get('/:id', stopController.getStopById);
router.get('/', stopController.getAllStops);
router.post('/', stopController.addStop);
router.put('/:id', stopController.updateStop);
router.delete('/:id', stopController.deleteStop);

module.exports = router;
