require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins (for development)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes with /api prefix (shared by admin panel and Flutter app)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/consultants", require("./routes/consultantRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("Backend running successfully - Admin & User API");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date(),
    services: ["admin-panel", "flutter-app"]
  });
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === "development" ? err.message : undefined 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Flutter App can connect to: http://localhost:${PORT}/api`);
  console.log(`💻 Admin Panel can connect to: http://localhost:${PORT}/api`);
});

module.exports = app;