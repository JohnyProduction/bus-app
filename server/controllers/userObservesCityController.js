const UserObservesCityRepository = require('../repositories/userObservesCityRepository');
const UserObservesCity = require('../models/userObservesCity');
const repository = new UserObservesCityRepository();

const getObservationById = (req, res) => {
  const id = req.params.id;
  repository.getObservationById(id, (err, observation) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(observation);
  });
};

const getAllObservations = (req, res) => {
  repository.getAllObservations((err, observations) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(observations);
  });
};

const addObservation = (req, res) => {
  const observation = new UserObservesCity(null, req.body.username, req.body.departureCity, req.body.destinationCity);
  repository.addObservation(observation, (err, newObservation) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newObservation);
  });
};

const updateObservation = (req, res) => {
  const observation = new UserObservesCity(req.params.id, req.body.username, req.body.departureCity, req.body.destinationCity);
  repository.updateObservation(observation, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(observation);
  });
};

const deleteObservation = (req, res) => {
  const id = req.params.id;
  repository.deleteObservation(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getObservationById,
  getAllObservations,
  addObservation,
  updateObservation,
  deleteObservation
};
