const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getAssignedPlans(req, res) {
  try {
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!clientProfile) {
      return res.status(404).json({ message: "Client profile not found" });
    }

    const assignments = await prisma.planAssignment.findMany({
      where: {
        clientId: clientProfile.id,
        isActive: true,
      },
      include: {
        plan: {
          include: {
            days: {
              orderBy: { sortOrder: "asc" },
              include: {
                exercises: {
                  orderBy: { sortOrder: "asc" },
                },
              },
            },
          },
        },
      },
      orderBy: { assignedAt: "desc" },
    });

    return res.status(200).json(assignments);
  } catch (error) {
    console.error("Get assigned plans error:", error);
    return res.status(500).json({ message: "Server error fetching assigned plans" });
  }
}

async function logWorkout(req, res) {
    try {
      const { assignmentId, workoutDayId, notes, difficultyRating } = req.body;
  
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: req.user.id },
      });
  
      if (!clientProfile) {
        return res.status(404).json({ message: "Client profile not found" });
      }
  
      const log = await prisma.workoutLog.create({
        data: {
          clientId: clientProfile.id,
          assignmentId: assignmentId || null,
          workoutDayId: workoutDayId || null,
          notes: notes || null,
          difficultyRating: difficultyRating || null,
        },
      });
  
      return res.status(201).json({
        message: "Workout logged successfully",
        log,
      });
    } catch (error) {
      console.error("Log workout error:", error);
      return res.status(500).json({ message: "Server error logging workout" });
    }
  }
  
  async function getWorkoutHistory(req, res) {
    try {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: req.user.id },
      });
  
      if (!clientProfile) {
        return res.status(404).json({ message: "Client profile not found" });
      }
  
      const logs = await prisma.workoutLog.findMany({
        where: { clientId: clientProfile.id },
        orderBy: { completedAt: "desc" },
      });
  
      return res.status(200).json(logs);
    } catch (error) {
      console.error("Workout history error:", error);
      return res.status(500).json({ message: "Server error fetching workout history" });
    }
  }

module.exports = {
  getAssignedPlans,
  logWorkout,
  getWorkoutHistory,
};