const authController = require('../controllers/authtentication_controllers');

const { Router } = require('express');

const authentication = Router();

authentication.post('/', authController.login);
authentication.post('/forgot', authController.forgot);
authentication.post('/reset-password/:id/:forgotToken', authController.resetPassword);

module.exports = authentication;
