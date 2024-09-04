const userRepository = require('../repositories/users_repositories');
const jwt = require('jsonwebtoken');
const mailService = require('../services/MailSender.js');
const bcrypt = require('bcrypt');
const { loginSchema, forgotSchema, resetSchema } = require('../validations/users_validations');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const userData = loginSchema.validate({ email, password });

      const user = await userRepository.findByEmail(email);

      console.log(user);

      if (!user) {
        const error = new Error('Please enter a valid email and password');
        error.status = 401;
        throw error;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        const error = new Error('Please enter a valid email and password');
        error.status = 401;
        throw error;
      }
      user.password = undefined;

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );
      //Criar Refresh Token no futuro
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      res.json({ token });
    } catch (error) {
      // console.error(error);
      return next(error);
    }
  }

  async forgot(req, res, next) {
    try {
      const { email } = req.body;
      const userEmail = forgotSchema.validate({ email });

      const user = await userRepository.findByEmail(email);
      if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }

      const forgotToken = jwt.sign({ id: user.id }, process.env.RESET_PASSWORD_SECRET, {
        expiresIn: '1h',
      });

      const forgotLink = `${process.env.BASE_URL}/reset/${user.id}/${forgotToken}`;
      // console.log(forgotLink);

      const forgotMail = await mailService(email, 'Reset Password', forgotLink);

      return res.status(200).json({ Mail: 'Email sent' });
    } catch (error) {
      // console.error(error);
      return next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { id, forgotToken } = req.params;
      const { password, confirmPassword } = req.body;

      const reset = resetSchema.validate({
        password: password,
        confirmPassword: confirmPassword,
      });

      const decoded = jwt.verify(forgotToken, process.env.RESET_PASSWORD_SECRET);

      const hashedPassword = await bcrypt.hash(password, 10);

      await userRepository.updatePassword(id, hashedPassword);

      return res.status(200).json({ message: 'Password updated' });
    } catch (error) {
      // console.error(error);
      return next(error);
    }
  }
}

module.exports = new AuthController();
