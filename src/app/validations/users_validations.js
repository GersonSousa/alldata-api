const yup = require('yup');

const userSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});

const forgotSchema = yup.object({
  email: yup.string().email().required(),
});

const resetSchema = yup.object({
  password: yup.string().required().min(6),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')]),
});

module.exports = { userSchema, loginSchema, forgotSchema, resetSchema };
