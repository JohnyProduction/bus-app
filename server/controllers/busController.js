const BusRepository = require('../repositories/busRepository');
const Bus = require('../models/bus');
const busRepository = new BusRepository();

const getBusById = (req, res) => {
  const id = req.params.id;
  busRepository.getBusById(id, (err, bus) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(bus);
  });
};

const getAllBuses = (req, res) => {
  busRepository.getAllBuses((err, buses) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(buses);
  });
};

const addBus = (req, res) => {
  const bus = new Bus(null, req.body.routeId, req.body.departureTime);
  busRepository.addBus(bus, (err, newBus) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newBus);
  });
};

const updateBus = (req, res) => {
  const bus = new Bus(req.params.id, req.body.routeId, req.body.departureTime);
  busRepository.updateBus(bus, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(bus);
  });
};

const deleteBus = (req, res) => {
  const id = req.params.id;
  busRepository.deleteBus(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getBusById,
  getAllBuses,
  addBus,
  updateBus,
  deleteBus
};
