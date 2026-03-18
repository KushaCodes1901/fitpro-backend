const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  createSession,
  getTrainerSessions,
} = require("../controllers/trainer.controller");
const { getClientSessions } = require("../controllers/client.controller");

const router = express.Router();

router.get("/trainer", authenticateToken, requireRole("TRAINER"), getTrainerSessions);
router.post("/trainer", authenticateToken, requireRole("TRAINER"), createSession);
router.get("/client", authenticateToken, requireRole("CLIENT"), getClientSessions);

module.exports = router;