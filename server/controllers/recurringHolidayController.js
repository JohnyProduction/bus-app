const RecurringHolidayRepository = require('../repositories/recurringHolidayRepository');
const RecurringHoliday = require('../models/recurringHoliday');
const repository = new RecurringHolidayRepository();

const getRecurringHolidayById = (req, res) => {
  const id = req.params.id;
  repository.getRecurringHolidayById(id, (err, recurringHoliday) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!recurringHoliday) return res.status(404).json({ message: 'Recurring holiday not found' });
    res.json(recurringHoliday);
  });
};

const getAllRecurringHolidays = (req, res) => {
  repository.getAllRecurringHolidays((err, recurringHolidays) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(recurringHolidays);
  });
};

const addRecurringHoliday = (req, res) => {
  const recurringHoliday = new RecurringHoliday(null, req.body.date, req.body.routeDepartureRuleId);
  repository.addRecurringHoliday(recurringHoliday, (err, newRecurringHoliday) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newRecurringHoliday);
  });
};

const updateRecurringHoliday = (req, res) => {
  const recurringHoliday = new RecurringHoliday(req.params.id, req.body.date, req.body.routeDepartureRuleId);
  repository.updateRecurringHoliday(recurringHoliday, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(recurringHoliday);
  });
};

const deleteRecurringHoliday = (req, res) => {
  const id = req.params.id;
  repository.deleteRecurringHoliday(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getRecurringHolidayById,
  getAllRecurringHolidays,
  addRecurringHoliday,
  updateRecurringHoliday,
  deleteRecurringHoliday
};
