const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const User = require('../models/user');
const bcrypt = require("bcryptjs");

class UserRepository {

  getUserByUsername(username, callback) {
    const sql = 'SELECT * FROM user WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      if (row) {
        const user = new User(row.username, row.email, row.password_hash, row.role);
        callback(null, user);
      } else {
        callback(null, null);
      }
    });
  }

  getAllUsers(callback) {
    const sql = 'SELECT * FROM user';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      const users = rows.map(row => new User(row.username, row.email, row.password_hash, row.role));
      callback(null, users);
    });
  }

  addUser(user, callback) {
    const sql = `INSERT INTO user (username, email, password_hash, role) VALUES (?, ?, ?, ?)`;
    db.run(sql, [user.username, user.email, user.passwordHash, user.role], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: user.id, username: user.username, email: user.email, role: user.role });
    });
  }

  updateUser(user, callback) {
    const sql = `UPDATE user SET email = ?, password_hash = ?, role = ? WHERE username = ?`;
    db.run(sql, [user.email, user.passwordHash, user.role, user.username], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, user);
    });
  }

  deleteUser(username, callback) {
    const sql = 'DELETE FROM user WHERE username = ?';
    db.run(sql, [username], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { message: `User ${username} deleted` });
    });
  }

  loginUser(email, password, callback) {
    const sql = `SELECT * FROM user WHERE email = ?`;

    db.get(sql, [email], async (err, user) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, user);
    });
  }
}

module.exports = UserRepository;
