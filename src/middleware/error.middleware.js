const { StatusCodes } = require('http-status-codes');

function notFound(req, res) {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({ message: err.message || 'Internal server error' });
}

module.exports = { notFound, errorHandler };
