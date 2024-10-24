const InactiveDateSpanRepository = require('../repositories/inactiveDateSpanRepository');
const InactiveDateSpan = require('../models/inactiveDateSpan');
const repository = new InactiveDateSpanRepository();

const getInactiveDateSpanById = (req, res) => {
  const id = req.params.id;
  repository.getInactiveDateSpanById(id, (err, inactiveDateSpan) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!inactiveDateSpan) return res.status(404).json({ message: 'Inactive date span not found' });
    res.json(inactiveDateSpan);
  });
};

const getAllInactiveDateSpans = (req, res) => {
  repository.getAllInactiveDateSpans((err, inactiveDateSpans) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(inactiveDateSpans);
  });
};

const addInactiveDateSpan = (req, res) => {
  const inactiveDateSpan = new InactiveDateSpan(null, req.body.startDate, req.body.endDate, req.body.routeDepartureRuleId);
  repository.addInactiveDateSpan(inactiveDateSpan, (err, newInactiveDateSpan) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newInactiveDateSpan);
  });
};

const updateInactiveDateSpan = (req, res) => {
  const inactiveDateSpan = new InactiveDateSpan(req.params.id, req.body.startDate, req.body.endDate, req.body.routeDepartureRuleId);
  repository.updateInactiveDateSpan(inactiveDateSpan, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(inactiveDateSpan);
  });
};

const deleteInactiveDateSpan = (req, res) => {
  const id = req.params.id;
  repository.deleteInactiveDateSpan(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getInactiveDateSpanById,
  getAllInactiveDateSpans,
  addInactiveDateSpan,
  updateInactiveDateSpan,
  deleteInactiveDateSpan
};
