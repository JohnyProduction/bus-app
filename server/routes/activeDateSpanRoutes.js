const express = require('express');
const router = express.Router();
const activeDateSpanController = require('../controllers/activeDateSpanController');

router.get('/:id', activeDateSpanController.getActiveDateSpanById);
router.get('/', activeDateSpanController.getAllActiveDateSpans);
router.post('/', activeDateSpanController.addActiveDateSpan);
router.put('/:id', activeDateSpanController.updateActiveDateSpan);
router.delete('/:id', activeDateSpanController.deleteActiveDateSpan);

module.exports = router;
