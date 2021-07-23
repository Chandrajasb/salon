const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
  time: {
    type: Timestamp,
    required: true,
  },
  services: [
    {
      service: {
        type: String,
        required: true,
      },
    },
  ],
});

const appointment = mongoose.model("appointment", appointmentSchema);

module.exports = appointmentSchema;
