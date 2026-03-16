const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

async function register(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Email already in use');

  const password = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password,
      fullName: data.fullName,
      role: data.role,
      trainerProfile: data.role === 'TRAINER' ? { create: {} } : undefined,
      clientProfile: data.role === 'CLIENT' ? { create: {} } : undefined,
    },
  });

  return createSession(user.id, user.role);
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');

  return createSession(user.id, user.role);
}

async function createSession(userId, role) {
  const payload = { sub: userId, role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

async function refresh(refreshToken) {
  const tokenRecord = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
  }

  const decoded = verifyRefreshToken(refreshToken);
  return createSession(decoded.sub, decoded.role);
}

async function logout(refreshToken) {
  if (!refreshToken) return;
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

async function me(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true, role: true, createdAt: true },
  });
}

module.exports = { register, login, refresh, logout, me };
