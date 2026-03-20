const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  getCurrentUser,
  updateCurrentUser,
  updatePassword,
  updateAvatar,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authenticateToken, getCurrentUser);
router.put("/me", authenticateToken, updateCurrentUser);
router.put("/me/password", authenticateToken, updatePassword);
router.put("/me/avatar", authenticateToken, updateAvatar);

module.exports = router;