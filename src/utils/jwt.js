const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signAccessToken = (payload) => jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiry });
const signRefreshToken = (payload) => jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiry });

const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);
const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
