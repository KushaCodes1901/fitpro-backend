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

module.exports = {
  getAssignedPlans,
};