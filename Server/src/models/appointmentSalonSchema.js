const mongoose = require("mongoose");

const appointmentSalonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    gender: {
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
    }
});

const AppointmentSalon = mongoose.model("APPOINTMENTSALON", appointmentSalonSchema);

module.exports = AppointmentSalon;
