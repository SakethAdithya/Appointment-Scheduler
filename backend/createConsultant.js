const mongoose = require("mongoose");
require("dotenv").config();

const Consultant = require("./models/consultant.model");

async function createConsultant() {
  await mongoose.connect(process.env.MONGO_URI);

  await Consultant.create({
    name: "Dr. Rajesh Kumar",
    specialization: "General Physician",
    isActive: true,
  });

  console.log("Consultant created");
  process.exit();
}

createConsultant();
