const DepartureWeekdayRepository = require('../repositories/departureWeekdayRepository');
const DepartureWeekday = require('../models/departureWeekday');
const repository = new DepartureWeekdayRepository();

const getDepartureWeekdayById = (req, res) => {
  const id = req.params.id;
  repository.getDepartureWeekdayById(id, (err, departureWeekday) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!departureWeekday) return res.status(404).json({ message: 'Departure weekday not found' });
    res.json(departureWeekday);
  });
};

const getAllDepartureWeekdays = (req, res) => {
  repository.getAllDepartureWeekdays((err, departureWeekdays) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(departureWeekdays);
  });
};

const addDepartureWeekday = (req, res) => {
  const departureWeekday = new DepartureWeekday(null, req.body.weekday, req.body.routeDepartureRuleId);
  repository.addDepartureWeekday(departureWeekday, (err, newDepartureWeekday) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newDepartureWeekday);
  });
};

const updateDepartureWeekday = (req, res) => {
  const departureWeekday = new DepartureWeekday(req.params.id, req.body.weekday, req.body.routeDepartureRuleId);
  repository.updateDepartureWeekday(departureWeekday, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(departureWeekday);
  });
};

const deleteDepartureWeekday = (req, res) => {
  const id = req.params.id;
  repository.deleteDepartureWeekday(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getDepartureWeekdayById,
  getAllDepartureWeekdays,
  addDepartureWeekday,
  updateDepartureWeekday,
  deleteDepartureWeekday
};
