const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getMyNotifications(req, res) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ message: "Server error fetching notifications" });
  }
}

async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.status(200).json(notification);
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ message: "Server error updating notification" });
  }
}

async function markAllNotificationsRead(req, res) {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({ message: "Server error updating notifications" });
  }
}

module.exports = {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};