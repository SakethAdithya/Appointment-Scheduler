require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");
const Consultant = require("./models/consultant.model");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data (optional - comment out if you don't want to clear)
    // await User.deleteMany({});
    // await Consultant.deleteMany({});
    // console.log("Cleared existing data");

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash("admin123", salt);

    const admin = await User.findOne({ email: "admin@example.com" });
    if (!admin) {
      await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: hashedAdminPassword,
        phone: "1234567890",
        role: "ADMIN"
      });
      console.log("✅ Admin created");
    } else {
      console.log("ℹ️  Admin already exists");
    }

    // Create Sample Users
    const hashedUserPassword = await bcrypt.hash("user123", salt);
    
    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedUserPassword,
        phone: "9876543210",
        role: "USER"
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedUserPassword,
        phone: "9876543211",
        role: "USER"
      }
    ];

    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create(userData);
        console.log(`✅ User created: ${userData.email}`);
      }
    }

    // Create Sample Consultants
    const consultants = [
      {
        name: "Dr. Sarah Johnson",
        specialization: "Cardiologist",
        email: "sarah.johnson@clinic.com",
        phone: "5551234567",
        isActive: true
      },
      {
        name: "Dr. Michael Chen",
        specialization: "Dermatologist",
        email: "michael.chen@clinic.com",
        phone: "5551234568",
        isActive: true
      },
      {
        name: "Dr. Emily Rodriguez",
        specialization: "Pediatrician",
        email: "emily.rodriguez@clinic.com",
        phone: "5551234569",
        isActive: true
      },
      {
        name: "Dr. David Kim",
        specialization: "Orthopedic Surgeon",
        email: "david.kim@clinic.com",
        phone: "5551234570",
        isActive: true
      }
    ];

    for (const consultantData of consultants) {
      const existing = await Consultant.findOne({ email: consultantData.email });
      if (!existing) {
        await Consultant.create(consultantData);
        console.log(`✅ Consultant created: ${consultantData.name}`);
      }
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📋 Test Credentials:");
    console.log("Admin - Email: admin@example.com, Password: admin123");
    console.log("User 1 - Email: john@example.com, Password: user123");
    console.log("User 2 - Email: jane@example.com, Password: user123");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();