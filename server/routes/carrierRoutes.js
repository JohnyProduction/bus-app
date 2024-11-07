const express = require('express');
const router = express.Router();
const carrierController = require('../controllers/carrierController');


router.get('/:id', carrierController.getCarrierById);
router.get('/', carrierController.getAllCarriers);
router.post('/', carrierController.addCarrier);
router.put('/:id', carrierController.updateCarrier);
router.delete('/:id', carrierController.deleteCarrier);

module.exports = router;
