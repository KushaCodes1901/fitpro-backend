const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/admin", authenticateToken, requireRole("ADMIN"), (req, res) => {
  res.json({ message: "Admin route works" });
});

router.get("/trainer", authenticateToken, requireRole("TRAINER"), (req, res) => {
  res.json({ message: "Trainer route works" });
});

router.get("/client", authenticateToken, requireRole("CLIENT"), (req, res) => {
  res.json({ message: "Client route works" });
});

module.exports = router;