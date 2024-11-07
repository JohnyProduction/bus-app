const RouteStopRepository = require('../repositories/routeStopRepository');
const RouteStop = require('../models/routeStop');
const {DepartureResponseDto, DepartureRequestDto} = require("../dtos/departureDto");
const repository = new RouteStopRepository();

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
  const stop = new RouteStop(null, req.body.previous, req.body.next, req.body.stopId, req.body.minutesFromPrevRouteStop, req.body.prizeFromPrevRouteStop);
  repository.addStop(stop, (err, newStop) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newStop);
  });
};

const updateStop = (req, res) => {
  const stop = new RouteStop(req.params.id, req.body.previous, req.body.next, req.body.stopId, req.body.minutesFromPrevRouteStop, req.body.prizeFromPrevRouteStop);
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

const getAllStopsFromTo = (req, res) => {
  const requestDto = new DepartureRequestDto(req.body);

  try {
    requestDto.validate();
  } catch (err) {
    throw err;
  }

  repository.getAllStopsFromTo(requestDto.from, requestDto.to, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const departureResponseDto = new DepartureResponseDto(data);

    return res.status(200).json(departureResponseDto);
  });
}

module.exports = {
  getStopById,
  getAllStops,
  addStop,
  updateStop,
  deleteStop,
  getAllStopsFromTo
};
