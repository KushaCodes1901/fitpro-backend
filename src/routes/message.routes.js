const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMyMessages,
  getConversationWithUser,
} = require("../controllers/message.controller");

const router = express.Router();

router.get("/", authenticateToken, getMyMessages);
router.post("/", authenticateToken, sendMessage);
router.get("/:userId", authenticateToken, getConversationWithUser);

module.exports = router;