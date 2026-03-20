const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  getAnnouncements,
  createAnnouncement,
} = require("../controllers/announcement.controller");

const router = express.Router();

router.get("/", authenticateToken, getAnnouncements);
router.post("/", authenticateToken, requireRole("ADMIN"), createAnnouncement);

module.exports = router;