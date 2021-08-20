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
    },
    status: {
        type: String,
        default: "pending",
    },
    assign: {
        type: String,
        default: "notAssigned",
    },
    rate: {
        type: Number,
        default: 0,
    },
    feedback: {
        type: String,
        default: "nofeedback",
    }
});

const AppointmentSalon = mongoose.model("APPOINTMENTSALON", appointmentSalonSchema);

module.exports = AppointmentSalon;
