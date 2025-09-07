const axios = require("axios");
const Certificate = require("../models/Certificate");
const uploadToCloudinary = require("../utilities/uploadImage");
const { awardPoints } = require("./gamificationController");

// Upload + ML Verification + Gamification
exports.uploadCertificate = async (req, res, next) => {
  try {
    const fileBuffer = req.file.buffer;
    const uploadRes = await uploadToCloudinary(fileBuffer, "certificates");

    // Call ML verification API
    // const mlResponse = await axios.post(process.env.CERT_VERIFIER_URL, {
    //   fileUrl: uploadRes.secure_url,
    //   title: req.body.title,
    //   issuer: req.body.issuer,
    // });

    const cert = await Certificate.create({
      userId: req.user.id,
      title: req.body.title,
      issuer: req.body.issuer,
      date: req.body.date,
      fileUrl: uploadRes.secure_url,
      verificationStatus: mlResponse.data.status || "pending",
      verificationLevel: req.body.verificationLevel || "institute"
    });

    if (cert.verificationStatus === "verified") {
      await awardPoints(req.user.id, "certificate", cert.verificationLevel);
    }

    res.status(201).json({ success: true, certificate: cert });
  } catch (err) {
    next(err);
  }
};

exports.getCertificatesByUser = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ userId: req.params.userId });
    res.status(200).json({ success: true, certificates });
  } catch (err) {
    next(err);
  }
};

exports.verifyCertificate = async (req, res, next) => {
  try {
    const { certId } = req.params;
    const { status, comments } = req.body;

    const certificate = await Certificate.findById(certId);
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });

    certificate.verificationStatus = status;
    certificate.verifierComments = comments || "";
    await certificate.save();

    if (status === "verified") {
      await awardPoints(certificate.userId, "certificate", certificate.verificationLevel);
    }

    res.status(200).json({ success: true, certificate });
  } catch (err) {
    next(err);
  }
};
