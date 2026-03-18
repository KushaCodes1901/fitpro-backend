const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { getAssignedPlans } = require("../controllers/client.controller");

const router = express.Router();

router.get("/plans", authenticateToken, requireRole("CLIENT"), getAssignedPlans);

module.exports = router;