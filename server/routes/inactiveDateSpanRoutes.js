const express = require('express');
const router = express.Router();
const inactiveDateSpanController = require('../controllers/inactiveDateSpanController');

// Trasy dla operacji na okresach nieaktywności
router.get('/:id', inactiveDateSpanController.getInactiveDateSpanById);
router.get('/', inactiveDateSpanController.getAllInactiveDateSpans);
router.post('/', inactiveDateSpanController.addInactiveDateSpan);
router.put('/:id', inactiveDateSpanController.updateInactiveDateSpan);
router.delete('/:id', inactiveDateSpanController.deleteInactiveDateSpan);

module.exports = router;
