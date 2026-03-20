const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function getCurrentUser(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        trainerProfile: true,
        clientProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Server error fetching user" });
  }
}

async function updateCurrentUser(req, res) {
  try {
    const { firstName, lastName } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName !== undefined ? { firstName } : {}),
        ...(lastName !== undefined ? { lastName } : {}),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update current user error:", error);
    return res.status(500).json({ message: "Server error updating user" });
  }
}

async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "currentPassword and newPassword are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash },
    });

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ message: "Server error updating password" });
  }
}

async function updateAvatar(req, res) {
  try {
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ message: "avatarUrl is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
      },
    });

    return res.status(200).json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update avatar error:", error);
    return res.status(500).json({ message: "Server error updating avatar" });
  }
}

async function updateClientProfile(req, res) {
  try {
    const { dateOfBirth, gender, height, fitnessGoal } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        clientProfile: true,
      },
    });

    if (!user || !user.clientProfile) {
      return res.status(404).json({ message: "Client profile not found" });
    }

    const updatedProfile = await prisma.clientProfile.update({
      where: { userId: req.user.id },
      data: {
        ...(dateOfBirth !== undefined
          ? { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }
          : {}),
        ...(gender !== undefined ? { gender } : {}),
        ...(height !== undefined ? { height } : {}),
        ...(fitnessGoal !== undefined ? { fitnessGoal } : {}),
      },
    });

    return res.status(200).json({
      message: "Client profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update client profile error:", error);
    return res.status(500).json({ message: "Server error updating client profile" });
  }
}

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  updatePassword,
  updateAvatar,
  updateClientProfile,
};