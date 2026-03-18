const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  getAssignedPlans,
  logWorkout,
  getWorkoutHistory,
} = require("../controllers/client.controller");

const router = express.Router();

router.get("/plans", authenticateToken, requireRole("CLIENT"), getAssignedPlans);
router.post("/workouts/log", authenticateToken, requireRole("CLIENT"), logWorkout);
router.get("/workouts/history", authenticateToken, requireRole("CLIENT"), getWorkoutHistory);

module.exports = router;