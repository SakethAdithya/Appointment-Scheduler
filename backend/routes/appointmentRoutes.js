const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { verifyToken, isAdmin, isUser } = require("../middleware/auth");

// User routes - Flutter app
router.post("/", verifyToken, isUser, appointmentController.createAppointment);
router.get("/my-appointments", verifyToken, isUser, appointmentController.getUserAppointments);
router.put("/:id/cancel", verifyToken, isUser, appointmentController.cancelAppointment);

// Admin routes - Admin panel
router.get("/all", verifyToken, isAdmin, appointmentController.getAllAppointments);
router.put("/:id/status", verifyToken, isAdmin, appointmentController.updateAppointmentStatus);

// Shared routes - Both admin and user
router.get("/available-slots", verifyToken, appointmentController.getAvailableSlots);
router.get("/:id", verifyToken, appointmentController.getAppointmentById);

module.exports = router;