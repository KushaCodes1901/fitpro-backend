const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createNotification({ userId, title, message, type = "INFO" }) {
  if (!userId) return null;

  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
}

module.exports = {
  createNotification,
};