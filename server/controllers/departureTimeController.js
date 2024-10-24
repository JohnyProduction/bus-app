const DepartureTimeRepository = require('../repositories/departureTimeRepository');
const DepartureTime = require('../models/departureTime');
const repository = new DepartureTimeRepository();

const getTimeById = (req, res) => {
  const id = req.params.id;
  repository.getTimeById(id, (err, time) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(time);
  });
};

const getAllTimes = (req, res) => {
  repository.getAllTimes((err, times) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(times);
  });
};

const addTime = (req, res) => {
  const time = new DepartureTime(null, req.body.hourMinute, req.body.routeDepartureRuleId);
  repository.addTime(time, (err, newTime) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newTime);
  });
};

const updateTime = (req, res) => {
  const time = new DepartureTime(req.params.id, req.body.hourMinute, req.body.routeDepartureRuleId);
  repository.updateTime(time, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(time);
  });
};

const deleteTime = (req, res) => {
  const id = req.params.id;
  repository.deleteTime(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getTimeById,
  getAllTimes,
  addTime,
  updateTime,
  deleteTime
};
