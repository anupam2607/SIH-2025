const express = require("express");
const router = express.Router();
const { createProject, getProjectsByUser, updateProject, deleteProject } = require("../controllers/projectController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.post("/", authenticateUser, createProject);
router.get("/:userId", authenticateUser, getProjectsByUser);
router.put("/:projectId", authenticateUser, updateProject);
router.delete("/:projectId", authenticateUser, deleteProject);

module.exports = router;
