const Appointment = require("../models/appointment.model");
const Consultant = require("../models/consultant.model");
const User = require("../models/user.model");
const { isWithinWorkingHours, getAvailableSlots } = require("../utils/timeUtils");

// CREATE APPOINTMENT - USER only
exports.createAppointment = async (req, res) => {
  try {
    const { consultantId, date, timeSlot } = req.body;
    const userId = req.user.id;

    // Validation
    if (!consultantId || !date || !timeSlot) {
      return res.status(400).json({ message: "Consultant, date and time slot are required" });
    }

    // Check if consultant exists
    const consultant = await Consultant.findById(consultantId);
    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    // Parse date and validate it's not in the past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return res.status(400).json({ message: "Cannot book appointments in the past" });
    }

    // Check if it's a weekend
    const dayOfWeek = appointmentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({ message: "Appointments only available Monday to Friday" });
    }

    // Validate time slot is within working hours (10:00-18:00)
    if (!isWithinWorkingHours(timeSlot)) {
      return res.status(400).json({ message: "Time slot must be between 10:00 and 18:00" });
    }

    // Check for overlapping appointments for the consultant
    const overlapping = await Appointment.findOne({
      consultant: consultantId,
      date: appointmentDate,
      timeSlot,
      status: { $nin: ["CANCELLED", "COMPLETED"] }
    });

    if (overlapping) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    // Check max 3 appointments per user per day
    const userAppointmentsToday = await Appointment.countDocuments({
      user: userId,
      date: appointmentDate,
      status: { $nin: ["CANCELLED"] }
    });

    if (userAppointmentsToday >= 3) {
      return res.status(400).json({ message: "Maximum 3 appointments allowed per day" });
    }

    // Create appointment
    const appointment = new Appointment({
      user: userId,
      consultant: consultantId,
      date: appointmentDate,
      timeSlot,
      status: "PENDING"
    });

    await appointment.save();

    // Populate for response
    await appointment.populate("user", "name email phone");
    await appointment.populate("consultant", "name specialization");

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment
    });
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ message: "Server error while creating appointment" });
  }
};

// GET USER APPOINTMENTS - USER only
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate("user", "name email phone")
      .populate("consultant", "name specialization email phone")
      .sort({ date: -1, timeSlot: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (err) {
    console.error("Get user appointments error:", err);
    res.status(500).json({ message: "Server error while fetching appointments" });
  }
};

// GET ALL APPOINTMENTS - ADMIN only
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, consultantId, date } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (consultantId) filter.consultant = consultantId;
    if (date) {
      const targetDate = new Date(date);
      filter.date = targetDate;
    }

    const appointments = await Appointment.find(filter)
      .populate("user", "name email phone")
      .populate("consultant", "name specialization email phone")
      .sort({ date: -1, timeSlot: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (err) {
    console.error("Get all appointments error:", err);
    res.status(500).json({ message: "Server error while fetching appointments" });
  }
};

// GET APPOINTMENT BY ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("consultant", "name specialization email phone");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check authorization (user can only see their own, admin can see all)
    if (req.user.role !== "ADMIN" && appointment.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this appointment" });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (err) {
    console.error("Get appointment error:", err);
    res.status(500).json({ message: "Server error while fetching appointment" });
  }
};

// UPDATE APPOINTMENT STATUS
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Validate status
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Business logic for status transitions
    const currentStatus = appointment.status;

    // Users can only cancel their own PENDING or CONFIRMED appointments
    if (req.user.role === "USER") {
      if (appointment.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to modify this appointment" });
      }
      if (status !== "CANCELLED") {
        return res.status(403).json({ message: "Users can only cancel appointments" });
      }
      if (!["PENDING", "CONFIRMED"].includes(currentStatus)) {
        return res.status(400).json({ message: "Can only cancel pending or confirmed appointments" });
      }
    }

    // Admins can change status with some restrictions
    if (req.user.role === "ADMIN") {
      // Cannot change status of completed or cancelled appointments
      if (["COMPLETED", "CANCELLED"].includes(currentStatus) && currentStatus !== status) {
        return res.status(400).json({ 
          message: `Cannot change status from ${currentStatus}` 
        });
      }
    }

    // Update status
    appointment.status = status;
    await appointment.save();

    await appointment.populate("user", "name email phone");
    await appointment.populate("consultant", "name specialization email phone");

    res.json({
      success: true,
      message: "Appointment status updated successfully",
      appointment
    });
  } catch (err) {
    console.error("Update appointment status error:", err);
    res.status(500).json({ message: "Server error while updating appointment" });
  }
};

// CANCEL APPOINTMENT - USER only (their own)
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user owns this appointment
    if (appointment.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to cancel this appointment" });
    }

    // Can only cancel PENDING or CONFIRMED appointments
    if (!["PENDING", "CONFIRMED"].includes(appointment.status)) {
      return res.status(400).json({ 
        message: "Can only cancel pending or confirmed appointments" 
      });
    }

    appointment.status = "CANCELLED";
    await appointment.save();

    await appointment.populate("user", "name email phone");
    await appointment.populate("consultant", "name specialization email phone");

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment
    });
  } catch (err) {
    console.error("Cancel appointment error:", err);
    res.status(500).json({ message: "Server error while cancelling appointment" });
  }
};

// GET AVAILABLE SLOTS for a consultant on a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { consultantId, date } = req.query;

    if (!consultantId || !date) {
      return res.status(400).json({ message: "Consultant ID and date are required" });
    }

    // Validate consultant exists
    const consultant = await Consultant.findById(consultantId);
    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    // Parse and validate date
    const targetDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (targetDate < today) {
      return res.status(400).json({ message: "Cannot check availability for past dates" });
    }

    // Check if it's a weekend
    const dayOfWeek = targetDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.json({
        success: true,
        date: targetDate,
        availableSlots: [],
        message: "No appointments available on weekends"
      });
    }

    // Get all booked slots for this consultant on this date
    const bookedAppointments = await Appointment.find({
      consultant: consultantId,
      date: targetDate,
      status: { $nin: ["CANCELLED", "COMPLETED"] }
    }).select("timeSlot");

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);

    // Get all possible slots and filter out booked ones
    const allSlots = getAvailableSlots();
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      success: true,
      date: targetDate,
      consultant: {
        id: consultant._id,
        name: consultant.name,
        specialization: consultant.specialization
      },
      totalSlots: allSlots.length,
      bookedSlots: bookedSlots.length,
      availableSlots
    });
  } catch (err) {
    console.error("Get available slots error:", err);
    res.status(500).json({ message: "Server error while fetching available slots" });
  }
};