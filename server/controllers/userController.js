const UserRepository = require('../repositories/userRepository');
const User = require('../models/user');
const repository = new UserRepository();

const getUserByUsername = (req, res) => {
  const username = req.params.username;
  repository.getUserByUsername(username, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  });
};

const getAllUsers = (req, res) => {
  repository.getAllUsers((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
};

const addUser = (req, res) => {
  const user = new User(req.body.username, req.body.email, req.body.passwordHash, req.body.role);
  repository.addUser(user, (err, newUser) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(newUser);
  });
};

const updateUser = (req, res) => {
  const user = new User(req.params.username, req.body.email, req.body.passwordHash, req.body.role);
  repository.updateUser(user, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(user);
  });
};

const deleteUser = (req, res) => {
  const username = req.params.username;
  repository.deleteUser(username, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = {
  getUserByUsername,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser
};
