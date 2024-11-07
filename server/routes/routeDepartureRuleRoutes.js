const express = require('express');
const router = express.Router();
const routeDepartureRuleController = require('../controllers/routeDepartureRuleController');

router.get('/:id', routeDepartureRuleController.getRuleById);
router.get('/', routeDepartureRuleController.getAllRules);
router.post('/', routeDepartureRuleController.addRule);
router.put('/:id', routeDepartureRuleController.updateRule);
router.delete('/:id', routeDepartureRuleController.deleteRule);

module.exports = router;
