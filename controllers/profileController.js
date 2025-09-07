const Profile = require("../models/Profile");

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate("userId", "name email role");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updated = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ success: true, profile: updated });
  } catch (err) {
    next(err);
  }
};
