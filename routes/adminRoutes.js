const express = require("express");
const router = express.Router();
const { getSystemStats, generateReports } = require("../controllers/adminController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

 router.get("/stats", authenticateUser, authorizeRole("admin"), getSystemStats);

// router.get("/reports", authenticateUser, authorizeRole("admin"), generateReports);

module.exports = router;
