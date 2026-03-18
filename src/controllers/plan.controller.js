const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createPlan(req, res) {
  try {
    const { name, description, difficulty, isTemplate, days } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Plan name is required" });
    }

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const createdPlan = await prisma.workoutPlan.create({
      data: {
        trainerId: trainerProfile.id,
        name,
        description,
        difficulty: difficulty || "INTERMEDIATE",
        isTemplate: !!isTemplate,
        days: {
          create: (days || []).map((day, dayIndex) => ({
            dayNumber: day.dayNumber ?? dayIndex + 1,
            name: day.name,
            sortOrder: day.sortOrder ?? dayIndex + 1,
            exercises: {
              create: (day.exercises || []).map((exercise, exerciseIndex) => ({
                exerciseName: exercise.exerciseName,
                sets: exercise.sets ?? null,
                reps: exercise.reps ?? null,
                restSeconds: exercise.restSeconds ?? null,
                notes: exercise.notes ?? null,
                sortOrder: exercise.sortOrder ?? exerciseIndex + 1,
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: {
            exercises: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Workout plan created successfully",
      plan: createdPlan,
    });
  } catch (error) {
    console.error("Create plan error:", error);
    return res.status(500).json({ message: "Server error creating workout plan" });
  }
}

async function listTrainerPlans(req, res) {
  try {
    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const plans = await prisma.workoutPlan.findMany({
      where: { trainerId: trainerProfile.id },
      orderBy: { createdAt: "desc" },
      include: {
        days: {
          include: {
            exercises: true,
          },
        },
        assignments: true,
      },
    });

    return res.status(200).json(plans);
  } catch (error) {
    console.error("List plans error:", error);
    return res.status(500).json({ message: "Server error fetching workout plans" });
  }
}

async function getPlanById(req, res) {
  try {
    const { id } = req.params;

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const plan = await prisma.workoutPlan.findFirst({
      where: {
        id,
        trainerId: trainerProfile.id,
      },
      include: {
        days: {
          orderBy: { sortOrder: "asc" },
          include: {
            exercises: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
        assignments: {
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
        },
      },
    });

    if (!plan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    return res.status(200).json(plan);
  } catch (error) {
    console.error("Get plan error:", error);
    return res.status(500).json({ message: "Server error fetching workout plan" });
  }
}

async function assignPlanToClient(req, res) {
  try {
    const { id } = req.params;
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

    const plan = await prisma.workoutPlan.findFirst({
      where: {
        id,
        trainerId: trainerProfile.id,
      },
    });

    if (!plan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    const clientUser = await prisma.user.findUnique({
      where: { email: clientEmail },
      include: { clientProfile: true },
    });

    if (!clientUser || !clientUser.clientProfile) {
      return res.status(404).json({ message: "Client not found" });
    }

    const assignment = await prisma.planAssignment.upsert({
      where: {
        planId_clientId: {
          planId: plan.id,
          clientId: clientUser.clientProfile.id,
        },
      },
      update: {
        isActive: true,
      },
      create: {
        planId: plan.id,
        clientId: clientUser.clientProfile.id,
        isActive: true,
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
        plan: true,
      },
    });

    return res.status(200).json({
      message: "Plan assigned successfully",
      assignment,
    });
  } catch (error) {
    console.error("Assign plan error:", error);
    return res.status(500).json({ message: "Server error assigning workout plan" });
  }
}

module.exports = {
  createPlan,
  listTrainerPlans,
  getPlanById,
  assignPlanToClient,
};