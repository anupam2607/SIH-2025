const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  issuer: String,
  date: Date,
  fileUrl: String,
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },
  verificationLevel: {
  type: String,
  enum: ["institute", "state", "national"],
  default: "institute"
},

  verifierComments: String
}, { timestamps: true });

module.exports = mongoose.model("Certificate", certificateSchema);
