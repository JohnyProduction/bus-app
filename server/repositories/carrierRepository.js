const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const Carrier = require('../models/carrier');

class CarrierRepository {

  getCarrierById(id, callback) {
    const sql = 'SELECT * FROM carrier WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      const carrier = new Carrier(row.id, row.name);
      callback(null, carrier);
    });
  }

  getAllCarriers(callback) {
    const sql = 'SELECT * FROM carrier';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const carriers = rows.map(row => new Carrier(row.id, row.name));
      callback(null, carriers);
    });
  }
  
  addCarrier(carrier, callback) {
    const sql = 'INSERT INTO carrier (name) VALUES (?)';
    db.run(sql, [carrier.name], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...carrier });
    });
  }

  updateCarrier(carrier, callback) {
    const sql = 'UPDATE carrier SET name = ? WHERE id = ?';
    db.run(sql, [carrier.name, carrier.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, carrier);
    });
  }

  deleteCarrier(id, callback) {
    const sql = 'DELETE FROM carrier WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Carrier with ID ${id} deleted` });
    });
  }
}

module.exports = CarrierRepository;
