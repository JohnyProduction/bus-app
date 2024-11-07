const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const ActiveDateSpan = require('../models/activeDateSpan');

class ActiveDateSpanRepository {

  getActiveDateSpanById(id, callback) {
    const sql = 'SELECT * FROM active_datespan WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      if (row) {
        const activeDateSpan = new ActiveDateSpan(row.id, row.start_date, row.end_date, row.route_departure_rule_id);
        callback(null, activeDateSpan);
      } else {
        callback(null, null); 
      }
    });
  }


  getAllActiveDateSpans(callback) {
    const sql = 'SELECT * FROM active_datespan';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const activeDateSpans = rows.map(row => new ActiveDateSpan(row.id, row.start_date, row.end_date, row.route_departure_rule_id));
      callback(null, activeDateSpans);
    });
  }


  addActiveDateSpan(activeDateSpan, callback) {
    const sql = `INSERT INTO active_datespan (start_date, end_date, route_departure_rule_id) VALUES (?, ?, ?)`;
    db.run(sql, [activeDateSpan.startDate, activeDateSpan.endDate, activeDateSpan.routeDepartureRuleId], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...activeDateSpan });
    });
  }

  updateActiveDateSpan(activeDateSpan, callback) {
    const sql = `UPDATE active_datespan SET start_date = ?, end_date = ?, route_departure_rule_id = ? WHERE id = ?`;
    db.run(sql, [activeDateSpan.startDate, activeDateSpan.endDate, activeDateSpan.routeDepartureRuleId, activeDateSpan.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, activeDateSpan);
    });
  }

  deleteActiveDateSpan(id, callback) {
    const sql = 'DELETE FROM active_datespan WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Active date span ${id} deleted` });
    });
  }
}

module.exports = ActiveDateSpanRepository;
