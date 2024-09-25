const jwt = require('jsonwebtoken');
async function ensureAuthenticated(req, res, next) {
  // const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const token = req.cookies.auth;

  if (!token) {
    return res.status(401).send({ error: 'Token not provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Erro de verificação do token:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = { ensureAuthenticated };
