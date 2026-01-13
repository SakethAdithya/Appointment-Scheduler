const Consultant = require("../models/consultant.model");

// GET ALL CONSULTANTS - Accessible by both ADMIN and USER
exports.getAllConsultants = async (req, res) => {
  try {
    const consultants = await Consultant.find({ isActive: true });
    res.json({
      success: true,
      count: consultants.length,
      consultants
    });
  } catch (err) {
    console.error("Get consultants error:", err);
    res.status(500).json({ message: "Server error while fetching consultants" });
  }
};

// GET CONSULTANT BY ID - Accessible by both ADMIN and USER
exports.getConsultantById = async (req, res) => {
  try {
    const consultant = await Consultant.findById(req.params.id);
    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    res.json({
      success: true,
      consultant
    });
  } catch (err) {
    console.error("Get consultant error:", err);
    res.status(500).json({ message: "Server error while fetching consultant" });
  }
};

// CREATE CONSULTANT - ADMIN only
exports.createConsultant = async (req, res) => {
  try {
    const { name, specialization, email, phone } = req.body;

    if (!name || !specialization) {
      return res.status(400).json({ message: "Name and specialization are required" });
    }

    const consultant = new Consultant({
      name,
      specialization,
      email,
      phone,
      isActive: true
    });

    await consultant.save();

    res.status(201).json({
      success: true,
      message: "Consultant created successfully",
      consultant
    });
  } catch (err) {
    console.error("Create consultant error:", err);
    res.status(500).json({ message: "Server error while creating consultant" });
  }
};

// UPDATE CONSULTANT - ADMIN only
exports.updateConsultant = async (req, res) => {
  try {
    const { name, specialization, email, phone, isActive } = req.body;

    const consultant = await Consultant.findByIdAndUpdate(
      req.params.id,
      { name, specialization, email, phone, isActive },
      { new: true, runValidators: true }
    );

    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    res.json({
      success: true,
      message: "Consultant updated successfully",
      consultant
    });
  } catch (err) {
    console.error("Update consultant error:", err);
    res.status(500).json({ message: "Server error while updating consultant" });
  }
};

// DELETE CONSULTANT - ADMIN only
exports.deleteConsultant = async (req, res) => {
  try {
    const consultant = await Consultant.findByIdAndDelete(req.params.id);

    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    res.json({
      success: true,
      message: "Consultant deleted successfully"
    });
  } catch (err) {
    console.error("Delete consultant error:", err);
    res.status(500).json({ message: "Server error while deleting consultant" });
  }
};