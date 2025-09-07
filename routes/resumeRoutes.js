const express = require("express");
const router = express.Router();
const { generateResume, generateSummary } = require("../controllers/resumeController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.get("/:userId/generate", authenticateUser, generateResume);
router.get("/:userId/summary", authenticateUser, generateSummary);

module.exports = router;
