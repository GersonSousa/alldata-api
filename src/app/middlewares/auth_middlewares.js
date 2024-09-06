const jwt = require('jsonwebtoken');

async function ensureAuthenticated(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      const error = new Error('Access token not provided');
      error.status = 401;
      return next(error);
    }

    const accessToken = authorizationHeader.split(' ')[1];

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

module.exports = { ensureAuthenticated };
