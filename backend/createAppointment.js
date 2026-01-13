const mongoose = require("mongoose");
require("dotenv").config();

const Appointment = require("./models/appointment.model");

const USER_ID = "69650439524f6dd26cb433dc";
const CONSULTANT_ID = "6965067c7280bb42ce39752d";

async function createAppointment() {
  await mongoose.connect(process.env.MONGO_URI);

  await Appointment.create({
    userId: USER_ID,
    consultantId: CONSULTANT_ID,
    date: "2026-01-15",
    startTime: "10:00",
    endTime: "10:30",
    status: "PENDING",
  });

  console.log("Sample appointment created successfully");
  process.exit();
}

createAppointment();
