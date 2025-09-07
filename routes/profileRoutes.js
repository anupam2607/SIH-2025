const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const {authenticateUser} = require("../middleware/authMiddleware");

router.get("/:userId", authenticateUser, getProfile);
router.put("/:userId",authenticateUser, updateProfile);

module.exports = router;
