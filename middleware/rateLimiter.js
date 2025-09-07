const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // limit each IP
  message: "Too many login attempts. Try again later.",
});

module.exports = authLimiter;
