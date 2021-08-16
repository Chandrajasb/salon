const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
    },
    cost: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    }
});
const Service = mongoose.model("SERVICE", serviceSchema);

module.exports = Service;
