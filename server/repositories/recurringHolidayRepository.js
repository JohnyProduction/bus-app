const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const RecurringHoliday = require('../models/recurringHoliday');

class RecurringHolidayRepository {

  getRecurringHolidayById(id, callback) {
    const sql = 'SELECT * FROM recurring_holiday WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      if (row) {
        const recurringHoliday = new RecurringHoliday(row.id, row.date, row.route_departure_rule);
        callback(null, recurringHoliday);
      } else {
        callback(null, null); 
      }
    });
  }

  getAllRecurringHolidays(callback) {
    const sql = 'SELECT * FROM recurring_holiday';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const recurringHolidays = rows.map(row => new RecurringHoliday(row.id, row.date, row.route_departure_rule));
      callback(null, recurringHolidays);
    });
  }

  addRecurringHoliday(recurringHoliday, callback) {
    const sql = `INSERT INTO recurring_holiday (date, route_departure_rule) VALUES (?, ?)`;
    db.run(sql, [recurringHoliday.date, recurringHoliday.routeDepartureRuleId], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...recurringHoliday });
    });
  }

  updateRecurringHoliday(recurringHoliday, callback) {
    const sql = `UPDATE recurring_holiday SET date = ?, route_departure_rule = ? WHERE id = ?`;
    db.run(sql, [recurringHoliday.date, recurringHoliday.routeDepartureRuleId, recurringHoliday.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, recurringHoliday);
    });
  }

  deleteRecurringHoliday(id, callback) {
    const sql = 'DELETE FROM recurring_holiday WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Recurring holiday ${id} deleted` });
    });
  }
}

module.exports = RecurringHolidayRepository;
