const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const Stop = require('../models/stop');

class StopRepository {

  getStopById(id, callback) {
    const sql = 'SELECT * FROM stop WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      const stop = new Stop(row.id, row.city_id, row.name);
      callback(null, stop);
    });
  }

  getAllStops(callback) {
    const sql = 'SELECT * FROM stop';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const stops = rows.map(row => new Stop(row.id, row.city_id, row.name));
      callback(null, stops);
    });
  }

  addStop(stop, callback) {
    const sql = `INSERT INTO stop (city_id, name)
                 VALUES (?, ?)`;
    db.run(sql, [stop.cityId, stop.name], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...stop });
    });
  }

  updateStop(stop, callback) {
    const sql = `UPDATE stop
                 SET city_id = ?, name = ?
                 WHERE id = ?`;
    db.run(sql, [stop.cityId, stop.name, stop.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, stop);
    });
  }

  deleteStop(id, callback) {
    const sql = 'DELETE FROM stop WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Stop with ID ${id} deleted` });
    });
  }
}

module.exports = StopRepository;
