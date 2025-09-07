const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load env variables
dotenv.config();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const projectRoutes = require("./routes/projectRoutes");
const gamificationRoutes = require("./routes/gamificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resume", resumeRoutes);

// Error middleware (optional if you added one)
const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
