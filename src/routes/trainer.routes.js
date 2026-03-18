const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
    getTrainerProfile,
    updateTrainerProfile,
    getTrainerClients,
    assignClientToTrainer,
    removeClientFromTrainer,
    getClientProgress,
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

router.get(
    "/clients",
    authenticateToken,
    requireRole("TRAINER"),
    getTrainerClients
  );
  
  router.post(
    "/clients/assign",
    authenticateToken,
    requireRole("TRAINER"),
    assignClientToTrainer
  );
  
  router.delete(
    "/clients/:clientId",
    authenticateToken,
    requireRole("TRAINER"),
    removeClientFromTrainer
  );

router.get(
    "/clients/:clientId/progress",
    authenticateToken,
    requireRole("TRAINER"),
    getClientProgress
  );

module.exports = router;