const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  getTrainerProfile,
  updateTrainerProfile,
} = require("../controllers/trainer.controller");

const router = express.Router();

router.get(
  "/profile",
  authenticateToken,
  requireRole("TRAINER"),
  getTrainerProfile
);

router.put(
  "/profile",
  authenticateToken,
  requireRole("TRAINER"),
  updateTrainerProfile
);

module.exports = router;