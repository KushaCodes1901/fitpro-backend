const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

const prisma = new PrismaClient();

async function register(req, res) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
    } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const allowedRoles = ["TRAINER", "CLIENT"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Role must be TRAINER or CLIENT",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        isActive: true,
        ...(role === "TRAINER"
          ? {
              trainerProfile: {
                create: {},
              },
            }
          : {
              clientProfile: {
                create: {},
              },
            }),
      },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Server error during registration",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login",
    });
  }
}

async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({
      message: "Server error fetching profile",
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
};