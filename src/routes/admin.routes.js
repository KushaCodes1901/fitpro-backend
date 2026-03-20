const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  getAllTrainers,
  getAllClients,
  updateUserStatus,
  getAnalytics,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/trainers", authenticateToken, requireRole("ADMIN"), getAllTrainers);
router.get("/clients", authenticateToken, requireRole("ADMIN"), getAllClients);
router.put("/users/:id/status", authenticateToken, requireRole("ADMIN"), updateUserStatus);
router.get("/analytics", authenticateToken, requireRole("ADMIN"), getAnalytics);

module.exports = router;