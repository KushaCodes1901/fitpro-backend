const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  getCurrentUser,
  updateCurrentUser,
  updateEmail,
  updatePassword,
  updateAvatar,
  updateClientProfile,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authenticateToken, getCurrentUser);
router.put("/me", authenticateToken, updateCurrentUser);
router.put("/me/email", authenticateToken, updateEmail);
router.put("/me/password", authenticateToken, updatePassword);
router.put("/me/avatar", authenticateToken, updateAvatar);
router.put("/me/client-profile", authenticateToken, updateClientProfile);

module.exports = router;