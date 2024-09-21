const userRepository = require('../repositories/users_repositories');
const jwt = require('jsonwebtoken');
const mailService = require('../services/MailSender.js');
const bcrypt = require('bcrypt');
const { loginSchema, forgotSchema, resetSchema } = require('../validations/users_validations');
const { ValidationError } = require('yup');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      //Validação dos dados
      await loginSchema.validate({ email, password });

      //Procurado o email enviado e Validar se existe
      const user = await userRepository.findByEmail(email);
      if (!user) {
        const error = new Error('Please enter a valid email and password');
        error.status = 401;
        throw error;
      }

      //Comparar a senha enviada com a salva no banco de dados
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        const error = new Error('Please enter a valid email and password');
        error.status = 401;
        throw error;
      }

      //Remover senha do objeto de usuário
      user.password = undefined;

      //Criação do token
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

      res.cookie('Acesstoken', token, {
        expires: new Date(Date.now() + 3600000), // 1 hour
        httpOnly: false,
      });

      //Retornar os dados do usuário e o token
      res.json({ token: token, user: user });
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationError = new Error(error.errors);
        validationError.status = 400;
        return next(validationError);
      }
      console.error(error);
      return next(error);
    }
  }

  async forgot(req, res, next) {
    try {
      const { email } = req.body;
      await forgotSchema.validate({ email });

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

      const forgotMail = await mailService(email, 'Reset Password', forgotLink);

      return res.status(200).json({ Mail: 'Email sent' });
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationError = new Error(error.errors);
        validationError.status = 400;
        return next(validationError);
      }
      console.error(error);
      return next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { id, forgotToken } = req.params;
      const { password, confirmPassword } = req.body;

      await resetSchema.validate({
        password: password,
        confirmPassword: confirmPassword,
      });

      const decoded = jwt.verify(forgotToken, process.env.RESET_PASSWORD_SECRET);

      const hashedPassword = await bcrypt.hash(password, 10);

      await userRepository.updatePassword(id, hashedPassword);

      return res.status(200).json({ message: 'Password updated' });
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationError = new Error(error.errors);
        validationError.status = 400;
        return next(validationError);
      }
      console.error(error);
      return next(error);
    }
  }
}

module.exports = new AuthController();
