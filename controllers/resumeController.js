
const Profile = require("../models/Profile");
const Project = require("../models/Project");
const Certificate = require("../models/Certificate");
exports.generateResume = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    const projects = await Project.find({ userId: req.params.userId });
    const certificates = await Certificate.find({ userId: req.params.userId });

    const data = { profile, projects, certificates };

    // Use dummy ML function
    const summary = await generateResumeSummary(data);

    res.status(200).json({ success: true, summary, data });
  } catch (err) {
    next(err);
  }
};
exports.generateSummary = async (data) => {
  // You can decide based on input what to return
  if (data?.projects || data?.certificates) {
    return "This is a dummy resume summary generated from profile, projects, and certificates.";
  }

  return "This is a dummy professional summary generated from profile data.";
};

