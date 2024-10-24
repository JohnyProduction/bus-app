const RouteRepository = require('../repositories/routeRepository');
const Route = require('../models/route');
const routeRepository = new RouteRepository();

const getRouteById = (req, res) => {
  const id = req.params.id;
  routeRepository.getRouteById(id, (err, route) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(route);
  });
};

const getAllRoutes = (req, res) => {
  routeRepository.getAllRoutes((err, routes) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(routes);
  });
};

const addRoute = (req, res) => {
  const route = new Route(null, req.body.carrierId, req.body.beginRouteStop, req.body.endRouteStop);
  routeRepository.addRoute(route, (err, newRoute) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newRoute);
  });
};

const updateRoute = (req, res) => {
  const route = new Route(req.params.id, req.body.carrierId, req.body.beginRouteStop, req.body.endRouteStop);
  routeRepository.updateRoute(route, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(route);
  });
};

const deleteRoute = (req, res) => {
  const id = req.params.id;
  routeRepository.deleteRoute(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getRouteById,
  getAllRoutes,
  addRoute,
  updateRoute,
  deleteRoute
};
