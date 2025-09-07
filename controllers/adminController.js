const User = require("../models/User");
const Certificate = require("../models/Certificate");

exports.getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    res.json({ success: true, stats: { totalUsers, totalCertificates } });
  } catch (err) {
    next(err);
  }
};

exports.generateReports = async (req, res, next) => {
  // Could use reportService to export CSV
};
// controllers/adminController.js
exports.getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    res.json({ success: true, stats: { totalUsers, totalCertificates } });
  } catch (err) {
    next(err);
  }
};
