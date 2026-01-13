const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/user.model");

async function createUser() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "user@example.com" });
  if (existing) {
    console.log("User already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("user123", 10);

  await User.create({
    name: "Test User",
    email: "user@example.com",
    password: hashedPassword,
    role: "USER",
  });

  console.log("✅ USER created successfully");
  process.exit();
}

createUser();
