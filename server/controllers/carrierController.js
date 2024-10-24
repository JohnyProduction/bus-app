const CarrierRepository = require('../repositories/carrierRepository');
const Carrier = require('../models/carrier');
const carrierRepository = new CarrierRepository();

const getCarrierById = (req, res) => {
  const id = req.params.id;
  carrierRepository.getCarrierById(id, (err, carrier) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(carrier);
  });
};

const getAllCarriers = (req, res) => {
  carrierRepository.getAllCarriers((err, carriers) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(carriers);
  });
};

const addCarrier = (req, res) => {
  const carrier = new Carrier(null, req.body.name);
  carrierRepository.addCarrier(carrier, (err, newCarrier) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newCarrier);
  });
};

const updateCarrier = (req, res) => {
  const carrier = new Carrier(req.params.id, req.body.name);
  carrierRepository.updateCarrier(carrier, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(carrier);
  });
};

const deleteCarrier = (req, res) => {
  const id = req.params.id;
  carrierRepository.deleteCarrier(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getCarrierById,
  getAllCarriers,
  addCarrier,
  updateCarrier,
  deleteCarrier
};
