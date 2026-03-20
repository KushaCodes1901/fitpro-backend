const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getAnnouncements(req, res) {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(announcements);
  } catch (error) {
    console.error("Get announcements error:", error);
    return res.status(500).json({ message: "Server error fetching announcements" });
  }
}

async function createAnnouncement(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "title and content are required" });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
      },
    });

    return res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error("Create announcement error:", error);
    return res.status(500).json({ message: "Server error creating announcement" });
  }
}

module.exports = {
  getAnnouncements,
  createAnnouncement,
};