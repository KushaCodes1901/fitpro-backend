const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  createPlan,
  listTrainerPlans,
  getPlanById,
  assignPlanToClient,
} = require("../controllers/plan.controller");

const router = express.Router();

router.get("/", authenticateToken, requireRole("TRAINER"), listTrainerPlans);
router.post("/", authenticateToken, requireRole("TRAINER"), createPlan);
router.get("/:id", authenticateToken, requireRole("TRAINER"), getPlanById);
router.post("/:id/assign", authenticateToken, requireRole("TRAINER"), assignPlanToClient);

module.exports = router;