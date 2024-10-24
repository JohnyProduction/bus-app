const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const Bus = require('../models/bus');

class BusRepository {

  getBusById(id, callback) {
    const sql = 'SELECT * FROM bus WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      const bus = new Bus(row.id, row.route_id, row.departure_time);
      callback(null, bus);
    });
  }

  getAllBuses(callback) {
    const sql = 'SELECT * FROM bus';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const buses = rows.map(row => new Bus(row.id, row.route_id, row.departure_time));
      callback(null, buses);
    });
  }

  addBus(bus, callback) {
    const sql = 'INSERT INTO bus (route_id, departure_time) VALUES (?, ?)';
    db.run(sql, [bus.routeId, bus.departureTime], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...bus });
    });
  }

  updateBus(bus, callback) {
    const sql = 'UPDATE bus SET route_id = ?, departure_time = ? WHERE id = ?';
    db.run(sql, [bus.routeId, bus.departureTime, bus.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, bus);
    });
  }

  deleteBus(id, callback) {
    const sql = 'DELETE FROM bus WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Bus with ID ${id} deleted` });
    });
  }
}

module.exports = BusRepository;
