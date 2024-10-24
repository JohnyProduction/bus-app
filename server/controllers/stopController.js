const StopRepository = require('../repositories/stopRepository');
const Stop = require('../models/stop');
const repository = new StopRepository();

const getStopById = (req, res) => {
  const id = req.params.id;
  repository.getStopById(id, (err, stop) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(stop);
  });
};

const getAllStops = (req, res) => {
  repository.getAllStops((err, stops) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(stops);
  });
};

const addStop = (req, res) => {
  const stop = new Stop(null, req.body.cityId, req.body.name);
  repository.addStop(stop, (err, newStop) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newStop);
  });
};

const updateStop = (req, res) => {
  const stop = new Stop(req.params.id, req.body.cityId, req.body.name);
  repository.updateStop(stop, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(stop);
  });
};

const deleteStop = (req, res) => {
  const id = req.params.id;
  repository.deleteStop(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getStopById,
  getAllStops,
  addStop,
  updateStop,
  deleteStop
};
