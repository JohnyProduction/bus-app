const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const RouteStop = require('../models/routeStop');

class RouteStopRepository {

  getStopById(id, callback) {
    const sql = 'SELECT * FROM route_stop WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      const stop = new RouteStop(row.id, row.previous, row.next, row.stop_id, row.minutes_from_prev_route_stop, row.prize_from_prev_route_stop);
      callback(null, stop);
    });
  }

  getAllStops(callback) {
    const sql = 'SELECT * FROM route_stop';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const stops = rows.map(row => new RouteStop(row.id, row.previous, row.next, row.stop_id, row.minutes_from_prev_route_stop, row.prize_from_prev_route_stop));
      callback(null, stops);
    });
  }

  addStop(stop, callback) {
    const sql = `INSERT INTO route_stop (previous, next, stop_id, minutes_from_prev_route_stop, prize_from_prev_route_stop)
                 VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [stop.previous, stop.next, stop.stopId, stop.minutesFromPrevRouteStop, stop.prizeFromPrevRouteStop], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...stop });
    });
  }

  updateStop(stop, callback) {
    const sql = `UPDATE route_stop
                 SET previous = ?, next = ?, stop_id = ?, minutes_from_prev_route_stop = ?, prize_from_prev_route_stop = ?
                 WHERE id = ?`;
    db.run(sql, [stop.previous, stop.next, stop.stopId, stop.minutesFromPrevRouteStop, stop.prizeFromPrevRouteStop, stop.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, stop);
    });
  }

  deleteStop(id, callback) {
    const sql = 'DELETE FROM route_stop WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Route stop with ID ${id} deleted` });
    });
  }
}

module.exports = RouteStopRepository;
