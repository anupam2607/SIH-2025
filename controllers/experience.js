exports.addExperience = async (req, res, next) => {
  try {
    const exp = await Experience.create({ ...req.body, userId: req.user.id });
    // add gamification points
    await awardPoints(req.user.id, req.body.type);
    res.status(201).json({ success: true, experience: exp });
  } catch (err) {
    next(err);
  }
};
