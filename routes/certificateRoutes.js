const express = require("express");
const router = express.Router();
const { uploadCertificate, getCertificatesByUser, verifyCertificate } = require("../controllers/certificateController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer(); // store file buffer in memory

router.post("/", authenticateUser, upload.single("file"), uploadCertificate);
router.get("/:userId", authenticateUser, getCertificatesByUser);
router.put("/:certId/verify", authenticateUser, authorizeRole("admin"), verifyCertificate);

module.exports = router;
