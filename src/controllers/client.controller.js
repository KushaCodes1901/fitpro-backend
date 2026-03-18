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

  async function logBodyMeasurement(req, res) {
    try {
      const {
        weight,
        bodyFat,
        chest,
        waist,
        hips,
        leftArm,
        rightArm,
        leftThigh,
        rightThigh,
        notes,
      } = req.body;
  
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: req.user.id },
      });
  
      if (!clientProfile) {
        return res.status(404).json({ message: "Client profile not found" });
      }
  
      const measurement = await prisma.bodyMeasurement.create({
        data: {
          clientId: clientProfile.id,
          weight: weight ?? null,
          bodyFat: bodyFat ?? null,
          chest: chest ?? null,
          waist: waist ?? null,
          hips: hips ?? null,
          leftArm: leftArm ?? null,
          rightArm: rightArm ?? null,
          leftThigh: leftThigh ?? null,
          rightThigh: rightThigh ?? null,
          notes: notes ?? null,
        },
      });
  
      return res.status(201).json({
        message: "Body measurement logged successfully",
        measurement,
      });
    } catch (error) {
      console.error("Log body measurement error:", error);
      return res.status(500).json({ message: "Server error logging body measurement" });
    }
  }
  
  async function getMyProgress(req, res) {
    try {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: req.user.id },
      });
  
      if (!clientProfile) {
        return res.status(404).json({ message: "Client profile not found" });
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
        measurements,
        workouts,
      });
    } catch (error) {
      console.error("Get my progress error:", error);
      return res.status(500).json({ message: "Server error fetching progress" });
    }
  }

  async function getClientSessions(req, res) {
    try {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: req.user.id },
      });
  
      if (!clientProfile) {
        return res.status(404).json({ message: "Client profile not found" });
      }
  
      const sessions = await prisma.session.findMany({
        where: { clientId: clientProfile.id },
        orderBy: { scheduledAt: "asc" },
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
      });
  
      return res.status(200).json(sessions);
    } catch (error) {
      console.error("Get client sessions error:", error);
      return res.status(500).json({ message: "Server error fetching client sessions" });
    }
  }

module.exports = {
  getAssignedPlans,
  logWorkout,
  getWorkoutHistory,
  logBodyMeasurement,
  getMyProgress,
  getClientSessions,
};