require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

async function recreateAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  // Delete any existing admin with this email
  await User.deleteMany({ email: "admin@example.com" });

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "ADMIN"
  });

  console.log("Admin recreated successfully");
  process.exit();
}

recreateAdmin();
