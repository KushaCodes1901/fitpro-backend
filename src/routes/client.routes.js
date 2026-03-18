const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  getAssignedPlans,
  logWorkout,
  getWorkoutHistory,
  logBodyMeasurement,
  getMyProgress,
} = require("../controllers/client.controller");

const router = express.Router();

router.get("/plans", authenticateToken, requireRole("CLIENT"), getAssignedPlans);
router.post("/workouts/log", authenticateToken, requireRole("CLIENT"), logWorkout);
router.get("/workouts/history", authenticateToken, requireRole("CLIENT"), getWorkoutHistory);

router.post("/progress", authenticateToken, requireRole("CLIENT"), logBodyMeasurement);
router.get("/progress", authenticateToken, requireRole("CLIENT"), getMyProgress);

module.exports = router;