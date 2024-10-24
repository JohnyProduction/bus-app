const CityRepository = require('../repositories/cityRepository');
const City = require('../models/city');
const repository = new CityRepository();

const getCityById = (req, res) => {
  const id = req.params.id;
  repository.getCityById(id, (err, city) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(city);
  });
};

const getAllCities = (req, res) => {
  repository.getAllCities((err, cities) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(cities);
  });
};

const addCity = (req, res) => {
  const city = new City(null, req.body.name);
  repository.addCity(city, (err, newCity) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newCity);
  });
};

const updateCity = (req, res) => {
  const city = new City(req.params.id, req.body.name);
  repository.updateCity(city, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(city);
  });
};

const deleteCity = (req, res) => {
  const id = req.params.id;
  repository.deleteCity(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getCityById,
  getAllCities,
  addCity,
  updateCity,
  deleteCity
};
