const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const UserObservesCity = require('../models/userObservesCity');

class UserObservesCityRepository {

  getObservationById(id, callback) {
    const sql = 'SELECT * FROM user_observes_city_connection WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      const observation = new UserObservesCity(row.id, row.username, row.departure_city, row.destination_city);
      callback(null, observation);
    });
  }

  getAllObservations(callback) {
    const sql = 'SELECT * FROM user_observes_city_connection';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const observations = rows.map(row => new UserObservesCity(row.id, row.username, row.departure_city, row.destination_city));
      callback(null, observations);
    });
  }

  addObservation(observation, callback) {
    const sql = `INSERT INTO user_observes_city_connection (username, departure_city, destination_city) VALUES (?, ?, ?)`;
    db.run(sql, [observation.username, observation.departureCity, observation.destinationCity], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...observation });
    });
  }

  updateObservation(observation, callback) {
    const sql = `UPDATE user_observes_city_connection SET username = ?, departure_city = ?, destination_city = ? WHERE id = ?`;
    db.run(sql, [observation.username, observation.departureCity, observation.destinationCity, observation.id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, observation);
    });
  }

  deleteObservation(id, callback) {
    const sql = 'DELETE FROM user_observes_city_connection WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `Observation with ID ${id} deleted` });
    });
  }
}

module.exports = UserObservesCityRepository;
