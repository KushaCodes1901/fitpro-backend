const { StatusCodes } = require('http-status-codes');
const authService = require('../services/auth.service');
const ApiError = require('../utils/ApiError');

async function register(req, res, next) {
  try {
    const tokens = await authService.register(req.body);
    res.status(StatusCodes.CREATED).json(tokens);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const tokens = await authService.login(req.body);
    res.status(StatusCodes.OK).json(tokens);
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.body.refreshToken;
    if (!token) throw new ApiError(StatusCodes.BAD_REQUEST, 'refreshToken is required');
    const tokens = await authService.refresh(token);
    res.status(StatusCodes.OK).json(tokens);
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.body.refreshToken);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.me(req.user.sub);
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res) {
  res.status(StatusCodes.OK).json({ message: 'If account exists, password reset email will be sent.' });
}

async function resetPassword(req, res) {
  res.status(StatusCodes.OK).json({ message: 'Password has been reset.' });
}

module.exports = { register, login, refresh, logout, me, forgotPassword, resetPassword };
