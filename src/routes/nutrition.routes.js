const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  createNutritionPlan,
  listTrainerNutritionPlans,
  assignNutritionPlanToClient,
  getClientNutritionPlans,
  updateNutritionPlan,
} = require("../controllers/nutrition.controller");

const router = express.Router();

router.get("/trainer", authenticateToken, requireRole("TRAINER"), listTrainerNutritionPlans);
router.post("/trainer", authenticateToken, requireRole("TRAINER"), createNutritionPlan);
router.put("/trainer/:id", authenticateToken, requireRole("TRAINER"), updateNutritionPlan);
router.post("/trainer/:id/assign", authenticateToken, requireRole("TRAINER"), assignNutritionPlanToClient);
router.get("/client", authenticateToken, requireRole("CLIENT"), getClientNutritionPlans);

module.exports = router;