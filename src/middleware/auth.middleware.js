const { StatusCodes } = require('http-status-codes');
const { verifyAccessToken } = require('../utils/jwt');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing bearer token' });
  }

  const token = authHeader.slice(7);
  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired access token' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
