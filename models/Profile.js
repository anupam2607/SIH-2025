const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  department: String,
  year: Number,
  skills: [String],
  resumeLink: String,
  portfolioLink: String
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
