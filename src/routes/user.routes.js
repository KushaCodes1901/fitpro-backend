const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authenticateToken, getCurrentUser);
router.put("/me", authenticateToken, updateCurrentUser);

module.exports = router;