const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const InactiveDateSpan = require('../models/inactiveDateSpan');

class InactiveDateSpanRepository {
  
  getInactiveDateSpanById(id, callback) {
    const sql = 'SELECT * FROM inactive_datespan WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      if (row) {
        const inactiveDateSpan = new InactiveDateSpan(row.id, row.start_date, row.end_date, row.route_departure_rule_id);
        callback(null, inactiveDateSpan);
      } else {
        callback(null, null); 
      }
    });
  }

  getAllInactiveDateSpans(callback) {
    const sql = 'SELECT * FROM inactive_datespan';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const inactiveDateSpans = rows.map(row => new InactiveDateSpan(row.id, row.start_date, row.end_date, row.route_departure_rule_id));
      callback(null, inactiveDateSpans);
    });
  }

  addInactiveDateSpan(inactiveDateSpan, callback) {
    const sql = `INSERT INTO inactive_datespan (start_date, end_date, route_departure_rule_id) VALUES (?, ?, ?)`;
    db.run(sql, [inactiveDateSpan.startDate, inactiveDateSpan.endDate, inactiveDateSpan.routeDepartureRuleId], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...inactiveDateSpan });
    });
  }

  updateInactiveDateSpan(inactiveDateSpan, callback) {
    const sql = `UPDATE inactive_datespan SET start_date = ?, end_date = ?, route_departure_rule_id = ? WHERE id = ?`;
    db.run(sql, [inactiveDateSpan.startDate, inactiveDateSpan.endDate, inactiveDateSpan.routeDepartureRuleId, inactiveDateSpan.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, inactiveDateSpan);
    });
  }

  deleteInactiveDateSpan(id, callback) {
    const sql = 'DELETE FROM inactive_datespan WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Inactive date span ${id} deleted` });
    });
  }
}

module.exports = InactiveDateSpanRepository;
