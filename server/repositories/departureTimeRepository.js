const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const DepartureTime = require('../models/departureTime');

class DepartureTimeRepository {

  getTimeById(id, callback) {
    const sql = 'SELECT * FROM departure_time WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      const time = new DepartureTime(row.id, row.hour_minute, row.route_departure_rule_id);
      callback(null, time);
    });
  }

  getAllTimes(callback) {
    const sql = 'SELECT * FROM departure_time';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const times = rows.map(row => new DepartureTime(row.id, row.hour_minute, row.route_departure_rule_id));
      callback(null, times);
    });
  }

  addTime(departureTime, callback) {
    const sql = `INSERT INTO departure_time (hour_minute, route_departure_rule_id)
                 VALUES (?, ?)`;
    db.run(sql, [departureTime.hourMinute, departureTime.routeDepartureRuleId], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...departureTime });
    });
  }

  updateTime(departureTime, callback) {
    const sql = `UPDATE departure_time
                 SET hour_minute = ?, route_departure_rule_id = ?
                 WHERE id = ?`;
    db.run(sql, [departureTime.hourMinute, departureTime.routeDepartureRuleId, departureTime.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, departureTime);
    });
  }

  deleteTime(id, callback) {
    const sql = 'DELETE FROM departure_time WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Departure time with ID ${id} deleted` });
    });
  }
}

module.exports = DepartureTimeRepository;
