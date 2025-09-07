const Project = require('../models/Profile')

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

exports.getProjectsByUser = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.params.userId }).populate("tags");
    res.json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.projectId, req.body, { new: true });
    res.json({ success: true, project: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.projectId);
    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};
