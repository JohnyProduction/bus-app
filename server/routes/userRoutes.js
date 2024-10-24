const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:username', userController.getUserByUsername);
router.get('/', userController.getAllUsers);
router.post('/', userController.addUser);
router.put('/:username', userController.updateUser);
router.delete('/:username', userController.deleteUser);

module.exports = router;
