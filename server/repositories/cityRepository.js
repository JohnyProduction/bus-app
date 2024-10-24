const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const City = require('../models/city');

class CityRepository {

  getCityById(id, callback) {
    const sql = 'SELECT * FROM city WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      const city = new City(row.id, row.name);
      callback(null, city);
    });
  }

  getAllCities(callback) {
    const sql = 'SELECT * FROM city';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const cities = rows.map(row => new City(row.id, row.name));
      callback(null, cities);
    });
  }

  addCity(city, callback) {
    const sql = `INSERT INTO city (name) VALUES (?)`;
    db.run(sql, [city.name], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...city });
    });
  }

  updateCity(city, callback) {
    const sql = `UPDATE city SET name = ? WHERE id = ?`;
    db.run(sql, [city.name, city.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, city);
    });
  }

  deleteCity(id, callback) {
    const sql = 'DELETE FROM city WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `City with ID ${id} deleted` });
    });
  }
}

module.exports = CityRepository;
