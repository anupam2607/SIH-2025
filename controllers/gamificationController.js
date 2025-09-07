const Gamification = require("../models/Gamification");

// Award points reusable function
exports.awardPoints = async (userId, activityType, level = null) => {
  let points = 0;

  if (activityType === "certificate") {
    if (level === "institute") points = 20;
    else if (level === "state") points = 30;
    else if (level === "national") points = 50;
  }
  if (activityType === "internship") points = 30;
  if (activityType === "hackathon") points = 50;
  if (activityType === "award") points = 40;
  if (activityType === "competition") points = 20;
  if (activityType === "club_activity") points = 15;

  let gamification = await Gamification.findOne({ userId });
  if (!gamification) gamification = new Gamification({ userId });

  gamification.points += points;
  gamification.breakdown[activityType] =
    (gamification.breakdown[activityType] || 0) + points;
  gamification.lastUpdated = Date.now();

  await gamification.save();
};

// Get gamification stats
exports.getUserStats = async (req, res, next) => {
  try {
    const gamification = await Gamification.findOne({ userId: req.params.userId });
    if (!gamification) return res.status(404).json({ message: "No gamification data found" });
    res.status(200).json({ success: true, gamification });
  } catch (err) {
    next(err);
  }
};

// Leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await Gamification.find()
      .populate("userId", "name email")
      .sort({ points: -1 })
      .limit(10);

    res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    next(err);
  }
};
