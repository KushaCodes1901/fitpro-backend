const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", authenticateToken, getMyNotifications);
router.put("/:id/read", authenticateToken, markNotificationRead);
router.put("/read-all", authenticateToken, markAllNotificationsRead);

module.exports = router;