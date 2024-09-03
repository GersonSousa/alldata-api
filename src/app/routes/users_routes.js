const userController = require('../controllers/users_controller');

const { Router } = require('express');

const user = Router();

user.post('/', userController.store);

module.exports = user;
