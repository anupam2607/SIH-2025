const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - User: ${req.user?.id || "Guest"}`);
  next();
};

module.exports = requestLogger;
