const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getTrainerProfile(req, res) {
  try {
    const profile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Get trainer profile error:", error);
    return res.status(500).json({ message: "Server error fetching trainer profile" });
  }
}

async function updateTrainerProfile(req, res) {
  try {
    const { bio, specializations, certifications, yearsExperience, phoneNumber } = req.body;

    const existingProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!existingProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const updatedProfile = await prisma.trainerProfile.update({
      where: { userId: req.user.id },
      data: {
        ...(bio !== undefined ? { bio } : {}),
        ...(specializations !== undefined ? { specializations } : {}),
        ...(certifications !== undefined ? { certifications } : {}),
        ...(yearsExperience !== undefined ? { yearsExperience } : {}),
        ...(phoneNumber !== undefined ? { phoneNumber } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Trainer profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update trainer profile error:", error);
    return res.status(500).json({ message: "Server error updating trainer profile" });
  }
}

module.exports = {
  getTrainerProfile,
  updateTrainerProfile,
};