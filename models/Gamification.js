const mongoose = require("mongoose");

const gamificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  points: { type: Number, default: 0 },
  badges: [String],
  rank: Number,
  points: { type: Number, default: 0 },
badges: [String],
rank: Number,

  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Gamification", gamificationSchema);
