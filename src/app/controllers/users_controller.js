const userRepository = require('../repositories/users_repositories');
const bcrypt = require('bcrypt');
const { userSchema } = require('../validations/users_validations');

class UserController {
  async store(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const user = userSchema.validate({ name, email, password });

      const existingUser = await userRepository.findByEmail(email);

      if (existingUser) {
        const error = new Error('Email already registered');
        error.status = 409;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userRepository.create({ name, email, password: hashedPassword });

      return res.status(201).json({ Usuário: newUser });
    } catch (error) {
      // console.error(error);
      return next(error);
    }
  }

  async index(req, res, next) {
    try {
      const users = await userRepository.findAll();
      return res.json(users);
    } catch (error) {
      // console.error(error);
      return next(error);
    }
  }

  async home(req, res, next) {
    try {
      return res.json({ message: 'Home Page' });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
}

module.exports = new UserController();
