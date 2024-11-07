const ActiveDateSpanRepository = require('../repositories/activeDateSpanRepository');
const ActiveDateSpan = require('../models/activeDateSpan');
const repository = new ActiveDateSpanRepository();

const getActiveDateSpanById = (req, res) => {
  const id = req.params.id;
  repository.getActiveDateSpanById(id, (err, activeDateSpan) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!activeDateSpan) return res.status(404).json({ message: 'Active date span not found' });
    res.json(activeDateSpan);
  });
};

const getAllActiveDateSpans = (req, res) => {
  repository.getAllActiveDateSpans((err, activeDateSpans) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(activeDateSpans);
  });
};

const addActiveDateSpan = (req, res) => {
  const activeDateSpan = new ActiveDateSpan(null, req.body.startDate, req.body.endDate, req.body.routeDepartureRuleId);
  repository.addActiveDateSpan(activeDateSpan, (err, newActiveDateSpan) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newActiveDateSpan);
  });
};

const updateActiveDateSpan = (req, res) => {
  const activeDateSpan = new ActiveDateSpan(req.params.id, req.body.startDate, req.body.endDate, req.body.routeDepartureRuleId);
  repository.updateActiveDateSpan(activeDateSpan, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(activeDateSpan);
  });
};

const deleteActiveDateSpan = (req, res) => {
  const id = req.params.id;
  repository.deleteActiveDateSpan(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getActiveDateSpanById,
  getAllActiveDateSpans,
  addActiveDateSpan,
  updateActiveDateSpan,
  deleteActiveDateSpan
};
