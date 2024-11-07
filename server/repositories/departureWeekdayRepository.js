const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const DepartureWeekday = require('../models/departureWeekday');

class DepartureWeekdayRepository {

  getDepartureWeekdayById(id, callback) {
    const sql = 'SELECT * FROM departure_weekday WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      if (row) {
        const departureWeekday = new DepartureWeekday(row.id, row.weekday, row.route_departure_rule_id);
        callback(null, departureWeekday);
      } else {
        callback(null, null);
      }
    });
  }


  getAllDepartureWeekdays(callback) {
    const sql = 'SELECT * FROM departure_weekday';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const departureWeekdays = rows.map(row => new DepartureWeekday(row.id, row.weekday, row.route_departure_rule_id));
      callback(null, departureWeekdays);
    });
  }


  addDepartureWeekday(departureWeekday, callback) {
    const sql = `INSERT INTO departure_weekday (weekday, route_departure_rule_id) VALUES (?, ?)`;
    db.run(sql, [departureWeekday.weekday, departureWeekday.routeDepartureRuleId], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...departureWeekday });
    });
  }

  updateDepartureWeekday(departureWeekday, callback) {
    const sql = `UPDATE departure_weekday SET weekday = ?, route_departure_rule_id = ? WHERE id = ?`;
    db.run(sql, [departureWeekday.weekday, departureWeekday.routeDepartureRuleId, departureWeekday.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, departureWeekday);
    });
  }

  deleteDepartureWeekday(id, callback) {
    const sql = 'DELETE FROM departure_weekday WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Departure weekday ${id} deleted` });
    });
  }
}

module.exports = DepartureWeekdayRepository;
