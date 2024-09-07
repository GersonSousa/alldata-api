const jwt = require('jsonwebtoken');

async function ensureAuthenticated(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      const error = new Error('Access token not provided or incorrectly formatted');
      error.status = 401;
      return next(error);
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      const error = new Error('Access token not provided');
      error.status = 401;
      return next(error);
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (!decoded) {
      const error = new Error('Invalid access token');
      error.status = 401;
      return next(error);
    }

    req.user = decoded;

    console.log(req.user);

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    error.status = 401; // Ensure consistent error status code
    next(error);
  }
}

module.exports = { ensureAuthenticated };
