const userController = require('../controllers/users_controller');
const { ensureAuthenticated } = require('../middlewares/auth_middlewares');

const { Router } = require('express');

const user = Router();

user.post('/', userController.store);
user.get('/', userController.index);
user.get('/home', userController.home);

module.exports = user;
