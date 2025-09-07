const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  type: {
    type: String,
    enum: ["internship", "hackathon", "award", "competition", "club_activity"]
  },
  duration: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Experience", experienceSchema);
