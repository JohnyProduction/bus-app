const RouteDepartureRuleRepository = require('../repositories/routeDepartureRuleRepository');
const RouteDepartureRule = require('../models/routeDepartureRule');
const repository = new RouteDepartureRuleRepository();

const getRuleById = (req, res) => {
  const id = req.params.id;
  repository.getRuleById(id, (err, rule) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rule);
  });
};

const getAllRules = (req, res) => {
  repository.getAllRules((err, rules) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rules);
  });
};

const addRule = (req, res) => {
  const rule = new RouteDepartureRule(null, req.body.routeId);
  repository.addRule(rule, (err, newRule) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newRule);
  });
};

const updateRule = (req, res) => {
  const rule = new RouteDepartureRule(req.params.id, req.body.routeId);
  repository.updateRule(rule, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rule);
  });
};

const deleteRule = (req, res) => {
  const id = req.params.id;
  repository.deleteRule(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getRuleById,
  getAllRules,
  addRule,
  updateRule,
  deleteRule
};
