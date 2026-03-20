const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getAllTrainers(req, res) {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: "TRAINER" },
      orderBy: { createdAt: "desc" },
      include: {
        trainerProfile: true,
      },
    });

    return res.status(200).json(trainers);
  } catch (error) {
    console.error("Get all trainers error:", error);
    return res.status(500).json({ message: "Server error fetching trainers" });
  }
}

async function getAllClients(req, res) {
  try {
    const clients = await prisma.user.findMany({
      where: { role: "CLIENT" },
      orderBy: { createdAt: "desc" },
      include: {
        clientProfile: {
          include: {
            trainer: {
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
        },
      },
    });

    return res.status(200).json(clients);
  } catch (error) {
    console.error("Get all clients error:", error);
    return res.status(500).json({ message: "Server error fetching clients" });
  }
}

async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be true or false" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    return res.status(200).json({
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user status error:", error);
    return res.status(500).json({ message: "Server error updating user status" });
  }
}

async function getAnalytics(req, res) {
  try {
    const totalTrainers = await prisma.user.count({
      where: { role: "TRAINER" },
    });

    const totalClients = await prisma.user.count({
      where: { role: "CLIENT" },
    });

    const activeUsers = await prisma.user.count({
      where: { isActive: true },
    });

    const totalWorkoutPlans = await prisma.workoutPlan.count();
    const totalNutritionPlans = await prisma.nutritionPlan.count();
    const totalSessions = await prisma.session.count();
    const totalMessages = await prisma.message.count();

    return res.status(200).json({
      totalTrainers,
      totalClients,
      activeUsers,
      totalWorkoutPlans,
      totalNutritionPlans,
      totalSessions,
      totalMessages,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return res.status(500).json({ message: "Server error fetching analytics" });
  }
}

module.exports = {
  getAllTrainers,
  getAllClients,
  updateUserStatus,
  getAnalytics,
};