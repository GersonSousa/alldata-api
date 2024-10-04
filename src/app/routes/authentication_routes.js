const authController = require('../controllers/authtentication_controllers');

const { Router } = require('express');
const { ensureAuthenticated } = require('../middlewares/auth_middlewares');

const authentication = Router();

authentication.post('/', authController.login);
authentication.post('/forgot', authController.forgot);
authentication.post('/reset-password/:id/:forgotToken', authController.resetPassword);
authentication.get('/check-auth', ensureAuthenticated, authController.checkAuth);
authentication.post('/logout', ensureAuthenticated, authController.logout);

module.exports = authentication;
