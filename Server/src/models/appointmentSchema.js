const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  service: {
    type: Array,
    required: true,
  },
  address: {
    type: String,
    required: true,
  }
});

const Appointment = mongoose.model("APPOINTMENT", appointmentSchema);

module.exports = Appointment;
