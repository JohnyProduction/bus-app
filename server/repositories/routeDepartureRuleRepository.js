const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const RouteDepartureRule = require('../models/routeDepartureRule');

class RouteDepartureRuleRepository {

  getRuleById(id, callback) {
    const sql = 'SELECT * FROM route_departure_rule WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      const rule = new RouteDepartureRule(row.id, row.route_id);
      callback(null, rule);
    });
  }

  getAllRules(callback) {
    const sql = 'SELECT * FROM route_departure_rule';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const rules = rows.map(row => new RouteDepartureRule(row.id, row.route_id));
      callback(null, rules);
    });
  }

  addRule(rule, callback) {
    const sql = 'INSERT INTO route_departure_rule (route_id) VALUES (?)';
    db.run(sql, [rule.routeId], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...rule });
    });
  }

  updateRule(rule, callback) {
    const sql = 'UPDATE route_departure_rule SET route_id = ? WHERE id = ?';
    db.run(sql, [rule.routeId, rule.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, rule);
    });
  }

  deleteRule(id, callback) {
    const sql = 'DELETE FROM route_departure_rule WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Rule with ID ${id} deleted` });
    });
  }
}

module.exports = RouteDepartureRuleRepository;
