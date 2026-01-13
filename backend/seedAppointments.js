require("dotenv").config();
const mongoose = require("mongoose");

const Appointment = require("./models/appointment.model");
const User = require("./models/user.model");
const Consultant = require("./models/consultant.model");

async function seedAppointments() {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ role: "USER" });
  const consultants = await Consultant.find();

  if (!user || consultants.length === 0) {
    console.log("❌ User or consultants missing");
    process.exit();
  }

  const appointments = [];
  const dates = ["2026-01-15", "2026-01-16"];
  const slots = [
    ["10:00", "10:30"],
    ["11:00", "11:30"],
    ["14:00", "14:30"]
  ];

  consultants.forEach((c, i) => {
    dates.forEach((date, j) => {
      slots.forEach((slot, k) => {
        appointments.push({
          userId: user._id,
          consultantId: c._id,
          date,
          startTime: slot[0],
          endTime: slot[1],
          status: ["PENDING", "CONFIRMED", "COMPLETED"][(i + j + k) % 3],
        });
      });
    });
  });

  await Appointment.insertMany(appointments);

  console.log(`✅ ${appointments.length} appointments created`);
  process.exit();
}

seedAppointments();
