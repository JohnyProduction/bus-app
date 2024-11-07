const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const Route = require('../models/route');

class RouteRepository {

  getRouteById(id, callback) {
    const sql = 'SELECT * FROM route WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      const route = new Route(row.id, row.carrier_id, row.begin_route_stop, row.end_route_stop);
      callback(null, route);
    });
  }

  getAllRoutes(callback) {
    const sql = 'SELECT * FROM route';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const routes = rows.map(row => new Route(row.id, row.carrier_id, row.begin_route_stop, row.end_route_stop));
      callback(null, routes);
    });
  }


  addRoute(route, callback) {
    const sql = 'INSERT INTO route (carrier_id, begin_route_stop, end_route_stop) VALUES (?, ?, ?)';
    db.run(sql, [route.carrierId, route.beginRouteStop, route.endRouteStop], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...route });
    });
  }

  updateRoute(route, callback) {
    const sql = 'UPDATE route SET carrier_id = ?, begin_route_stop = ?, end_route_stop = ? WHERE id = ?';
    db.run(sql, [route.carrierId, route.beginRouteStop, route.endRouteStop, route.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, route);
    });
  }

  deleteRoute(id, callback) {
    const sql = 'DELETE FROM route WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Route with ID ${id} deleted` });
    });
  }
}

module.exports = RouteRepository;
