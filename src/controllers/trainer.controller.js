const { PrismaClient } = require("@prisma/client");
const { createNotification } = require("../utils/notificationService");

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

async function getTrainerClients(req, res) {
  try {
    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const clients = await prisma.clientProfile.findMany({
      where: { trainerId: trainerProfile.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    return res.status(200).json(clients);
  } catch (error) {
    console.error("Get trainer clients error:", error);
    return res.status(500).json({ message: "Server error fetching clients" });
  }
}

async function assignClientToTrainer(req, res) {
  try {
    const { clientEmail } = req.body;

    if (!clientEmail) {
      return res.status(400).json({ message: "clientEmail is required" });
    }

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const clientUser = await prisma.user.findUnique({
      where: { email: clientEmail },
      include: {
        clientProfile: true,
      },
    });

    if (!clientUser || clientUser.role !== "CLIENT" || !clientUser.clientProfile) {
      return res.status(404).json({ message: "Client not found" });
    }

    const updatedClientProfile = await prisma.clientProfile.update({
      where: { userId: clientUser.id },
      data: {
        trainerId: trainerProfile.id,
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
      message: "Client assigned successfully",
      client: updatedClientProfile,
    });
  } catch (error) {
    console.error("Assign client error:", error);
    return res.status(500).json({ message: "Server error assigning client" });
  }
}

async function removeClientFromTrainer(req, res) {
  try {
    const { clientId } = req.params;

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { id: clientId },
    });

    if (!clientProfile) {
      return res.status(404).json({ message: "Client profile not found" });
    }

    if (clientProfile.trainerId !== trainerProfile.id) {
      return res.status(403).json({ message: "You can only remove your own clients" });
    }

    const updatedClientProfile = await prisma.clientProfile.update({
      where: { id: clientId },
      data: {
        trainerId: null,
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
      message: "Client removed successfully",
      client: updatedClientProfile,
    });
  } catch (error) {
    console.error("Remove client error:", error);
    return res.status(500).json({ message: "Server error removing client" });
  }
}

async function getClientProgress(req, res) {
  try {
    const { clientId } = req.params;

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { id: clientId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!clientProfile) {
      return res.status(404).json({ message: "Client profile not found" });
    }

    if (clientProfile.trainerId !== trainerProfile.id) {
      return res.status(403).json({ message: "You can only view progress for your own clients" });
    }

    const measurements = await prisma.bodyMeasurement.findMany({
      where: { clientId: clientProfile.id },
      orderBy: { loggedAt: "desc" },
    });

    const workouts = await prisma.workoutLog.findMany({
      where: { clientId: clientProfile.id },
      orderBy: { completedAt: "desc" },
    });

    return res.status(200).json({
      client: clientProfile.user,
      measurements,
      workouts,
    });
  } catch (error) {
    console.error("Get client progress error:", error);
    return res.status(500).json({ message: "Server error fetching client progress" });
  }
}

async function createSession(req, res) {
  try {
    const { clientEmail, scheduledAt, durationMin, type, notes } = req.body;

    if (!clientEmail || !scheduledAt) {
      return res.status(400).json({ message: "clientEmail and scheduledAt are required" });
    }

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const clientUser = await prisma.user.findUnique({
      where: { email: clientEmail },
      include: { clientProfile: true },
    });

    if (!clientUser || !clientUser.clientProfile) {
      return res.status(404).json({ message: "Client not found" });
    }

    const session = await prisma.session.create({
      data: {
        trainerId: trainerProfile.id,
        clientId: clientUser.clientProfile.id,
        scheduledAt: new Date(scheduledAt),
        durationMin: durationMin || 60,
        type: type || "ONLINE",
        notes: notes || null,
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    await createNotification({
      userId: clientUser.id,
      title: "New Session Scheduled",
      message: `A ${type || "ONLINE"} session was scheduled for you`,
      type: "SESSION",
    });

    return res.status(201).json({
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    console.error("Create session error:", error);
    return res.status(500).json({ message: "Server error creating session" });
  }
}

async function getTrainerSessions(req, res) {
  try {
    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const sessions = await prisma.session.findMany({
      where: { trainerId: trainerProfile.id },
      orderBy: { scheduledAt: "asc" },
      include: {
        client: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(sessions);
  } catch (error) {
    console.error("Get trainer sessions error:", error);
    return res.status(500).json({ message: "Server error fetching trainer sessions" });
  }
}

module.exports = {
  getTrainerProfile,
  updateTrainerProfile,
  getTrainerClients,
  assignClientToTrainer,
  removeClientFromTrainer,
  getClientProgress,
  createSession,
  getTrainerSessions,
};