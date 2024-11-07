const UserRepository = require('../repositories/userRepository');
const User = require('../models/user');
const { CreateUserDto, LoginUserDto, LoggedInUserResponseDto} = require("../dtos/userDto");
const repository = new UserRepository();
const bcrypt = require("bcryptjs");
const {basicEncode} = require("../auth");

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

const addUser = async (req, res) => {
  const createUserDto = new CreateUserDto(req.body);

  try {
    createUserDto.validate();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
  const role = "user";
  const user = new User(req.body.username, req.body.email, hashedPassword, role);

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

const loginUser = async (req, res) => {
  const loginUserDto = new LoginUserDto(req.body);

  try {
    loginUserDto.validate();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  repository.loginUser(loginUserDto.email, loginUserDto.password, async (err, user) => {
    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
    }

    const basic = basicEncode(user.id, user.role);
    const responseDto = new LoggedInUserResponseDto({ basic, user: { id: user.id, username: user.username, email: user.email, role: user.role }})

    res.status(200).json(responseDto);
  });
};

module.exports = {
  getUserByUsername,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  loginUser
};
