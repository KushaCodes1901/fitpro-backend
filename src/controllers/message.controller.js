const { PrismaClient } = require("@prisma/client");
const { createNotification } = require("../utils/notificationService");

const prisma = new PrismaClient();

async function sendMessage(req, res) {
  try {
    const { receiverEmail, content } = req.body;

    if (!receiverEmail || !content) {
      return res.status(400).json({ message: "receiverEmail and content are required" });
    }

    const sender = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        trainerProfile: true,
        clientProfile: true,
      },
    });

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail },
      include: {
        trainerProfile: true,
        clientProfile: true,
      },
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (sender.id === receiver.id) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    const senderTrainerId = sender.trainerProfile?.id || null;
    const senderClientTrainerId = sender.clientProfile?.trainerId || null;
    const receiverTrainerId = receiver.trainerProfile?.id || null;
    const receiverClientTrainerId = receiver.clientProfile?.trainerId || null;

    const allowed =
      sender.role === "ADMIN" ||
      receiver.role === "ADMIN" ||
      (sender.role === "TRAINER" &&
        receiver.role === "CLIENT" &&
        receiverClientTrainerId === senderTrainerId) ||
      (sender.role === "CLIENT" &&
        receiver.role === "TRAINER" &&
        senderClientTrainerId === receiverTrainerId);

    if (!allowed) {
      return res.status(403).json({
        message: "You can only message your assigned trainer or clients",
      });
    }

    const message = await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
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

    await createNotification({
      userId: receiver.id,
      title: "New Message",
      message: `${sender.firstName} sent you a message`,
      type: "MESSAGE",
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ message: "Server error sending message" });
  }
}

async function getMyMessages(req, res) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: req.user.id }, { receiverId: req.user.id }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
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

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Get my messages error:", error);
    return res.status(500).json({ message: "Server error fetching messages" });
  }
}

async function getConversationWithUser(req, res) {
  try {
    const { userId } = req.params;

    const otherUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: userId },
          { senderId: userId, receiverId: req.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
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

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Get conversation error:", error);
    return res.status(500).json({ message: "Server error fetching conversation" });
  }
}

module.exports = {
  sendMessage,
  getMyMessages,
  getConversationWithUser,
};