const express = require("express");
const router = express.Router();
const { getUserStats, getLeaderboard, awardPoints } = require("../controllers/gamificationController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.get("/:userId", authenticateUser, getUserStats);
router.get("/", authenticateUser, getLeaderboard);
router.post("/add-points", authenticateUser, awardPoints);

module.exports = router;
