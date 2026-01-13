const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/user.model");

async function resetAdminPassword() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const result = await User.updateOne(
    { email: "admin@example.com" },
    {
      $set: {
        password: hashedPassword,
        role: "ADMIN",
      },
    }
  );

  console.log("Admin password reset:", result);
  process.exit();
}

resetAdminPassword();
