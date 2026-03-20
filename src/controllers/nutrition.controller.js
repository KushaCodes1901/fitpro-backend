const { PrismaClient } = require("@prisma/client");
const { createNotification } = require("../utils/notificationService");

const prisma = new PrismaClient();

async function createNutritionPlan(req, res) {
  try {
    const {
      name,
      description,
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      meals,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nutrition plan name is required" });
    }

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const plan = await prisma.nutritionPlan.create({
      data: {
        trainerId: trainerProfile.id,
        name,
        description: description || null,
        dailyCalories: dailyCalories ?? null,
        proteinGrams: proteinGrams ?? null,
        carbsGrams: carbsGrams ?? null,
        fatGrams: fatGrams ?? null,
        meals: {
          create: (meals || []).map((meal, index) => ({
            name: meal.name,
            description: meal.description || null,
            calories: meal.calories ?? null,
            protein: meal.protein ?? null,
            carbs: meal.carbs ?? null,
            fat: meal.fat ?? null,
            sortOrder: meal.sortOrder ?? index + 1,
          })),
        },
      },
      include: {
        meals: true,
      },
    });

    return res.status(201).json({
      message: "Nutrition plan created successfully",
      plan,
    });
  } catch (error) {
    console.error("Create nutrition plan error:", error);
    return res.status(500).json({ message: "Server error creating nutrition plan" });
  }
}

async function listTrainerNutritionPlans(req, res) {
  try {
    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const plans = await prisma.nutritionPlan.findMany({
      where: { trainerId: trainerProfile.id },
      orderBy: { createdAt: "desc" },
      include: {
        meals: {
          orderBy: { sortOrder: "asc" },
        },
        assignments: true,
      },
    });

    return res.status(200).json(plans);
  } catch (error) {
    console.error("List nutrition plans error:", error);
    return res.status(500).json({ message: "Server error fetching nutrition plans" });
  }
}

async function updateNutritionPlan(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      meals,
    } = req.body;

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const existingPlan = await prisma.nutritionPlan.findFirst({
      where: {
        id,
        trainerId: trainerProfile.id,
      },
      include: {
        meals: true,
      },
    });

    if (!existingPlan) {
      return res.status(404).json({ message: "Nutrition plan not found" });
    }

    await prisma.meal.deleteMany({
      where: { nutritionPlanId: id },
    });

    const updatedPlan = await prisma.nutritionPlan.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(dailyCalories !== undefined ? { dailyCalories } : {}),
        ...(proteinGrams !== undefined ? { proteinGrams } : {}),
        ...(carbsGrams !== undefined ? { carbsGrams } : {}),
        ...(fatGrams !== undefined ? { fatGrams } : {}),
        meals: {
          create: (meals || []).map((meal, index) => ({
            name: meal.name,
            description: meal.description || null,
            calories: meal.calories ?? null,
            protein: meal.protein ?? null,
            carbs: meal.carbs ?? null,
            fat: meal.fat ?? null,
            sortOrder: meal.sortOrder ?? index + 1,
          })),
        },
      },
      include: {
        meals: {
          orderBy: { sortOrder: "asc" },
        },
        assignments: true,
      },
    });

    return res.status(200).json({
      message: "Nutrition plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error) {
    console.error("Update nutrition plan error:", error);
    return res.status(500).json({ message: "Server error updating nutrition plan" });
  }
}

async function assignNutritionPlanToClient(req, res) {
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

    const plan = await prisma.nutritionPlan.findFirst({
      where: {
        id,
        trainerId: trainerProfile.id,
      },
    });

    if (!plan) {
      return res.status(404).json({ message: "Nutrition plan not found" });
    }

    const clientUser = await prisma.user.findUnique({
      where: { email: clientEmail },
      include: { clientProfile: true },
    });

    if (!clientUser || !clientUser.clientProfile) {
      return res.status(404).json({ message: "Client not found" });
    }

    const assignment = await prisma.nutritionPlanAssignment.upsert({
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
        plan: {
          include: {
            meals: true,
          },
        },
      },
    });

    await createNotification({
      userId: clientUser.id,
      title: "Nutrition Plan Assigned",
      message: `You received a new nutrition plan: ${plan.name}`,
      type: "NUTRITION",
    });

    return res.status(200).json({
      message: "Nutrition plan assigned successfully",
      assignment,
    });
  } catch (error) {
    console.error("Assign nutrition plan error:", error);
    return res.status(500).json({ message: "Server error assigning nutrition plan" });
  }
}

async function getClientNutritionPlans(req, res) {
  try {
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!clientProfile) {
      return res.status(404).json({ message: "Client profile not found" });
    }

    const assignments = await prisma.nutritionPlanAssignment.findMany({
      where: {
        clientId: clientProfile.id,
        isActive: true,
      },
      include: {
        plan: {
          include: {
            meals: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
      orderBy: { assignedAt: "desc" },
    });

    return res.status(200).json(assignments);
  } catch (error) {
    console.error("Get client nutrition plans error:", error);
    return res.status(500).json({ message: "Server error fetching client nutrition plans" });
  }
}

module.exports = {
  createNutritionPlan,
  listTrainerNutritionPlans,
  assignNutritionPlanToClient,
  getClientNutritionPlans,
  updateNutritionPlan,
};