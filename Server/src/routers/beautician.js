const express = require("express");
const beauticianRouter = express.Router();
require("../db/conn");
const Beautician = require("../models/beauticianSchema");
const Service = require("../models/serviceSchema");
beauticianRouter.use(express.json());
const beauticianAuthenticate = require("../middleware/beauticianAuthenticate");
const Appointment = require("../models/appointmentSchema");
const AppointmentSalon = require("../models/appointmentSalonSchema");
const Contact = require("../models/contactSchema");
const methodOverride = require("method-override");
beauticianRouter.use(methodOverride("_method"));
const bcrypt = require("bcryptjs");

beauticianRouter.get("/beauticianLogin", (req, res) => {
    res.render("beauticianLogin");
});
// beauticianRouter.get("/beauticianpage", beauticianAuthenticate, async (req, res) => {
//     res.render("beauticianpage");
// });
beauticianRouter.get("/beautician/appointment", beauticianAuthenticate, async (req, res) => {
    const _id = req.rootBeautician._id;
    const name = req.rootBeautician.name;
    try {
        const appointments = await Appointment.find({ assign: _id, status: "pending" });
        if (!appointments) {
            throw new Error("Appointments not found");
        }
        // const appointmentsSalon = await AppointmentSalon.find({ assign: _id, status: "pending" });
        // if (!appointmentsSalon) {
        //     throw new Error("Appointments not found");
        // }
        console.log(appointments);
        // console.log(appointmentsSalon);
        console.log(name);
        res.render("beauticianpage", { appointments: appointments,name:name });
    } catch (err) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(err);
    }
});
//Edit Appointment
beauticianRouter.put("/beautician/editAppointment/:id", beauticianAuthenticate, async (req, res) => {
    try {
        const _id = req.params.id;
        const appointment = await Appointment.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
       
        console.log(appointment);
         res.redirect("/beautician/appointment");
    } catch (err) {
        res.status(500).send(err);
    }
});
//Edit Appointment salon
beauticianRouter.put("/editAppointmentSalon/:id", beauticianAuthenticate, async (req, res) => {
    try {
        const _id = req.params.id;
        const appointmentSalon = await AppointmentSalon.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
        // res.redirect("/listAppointments");
        console.log(appointmentSalon);
    } catch (err) {
        res.status(500).send(err);
    }
});
beauticianRouter.post("/beauticianlogin", async (req, res) => {
    try {
        const { phone_no, password } = req.body;
        if (!phone_no || !password) {
            return res.status(400).json({ error: "Fill both the fields" });
        }
        const beauticianLogin = await Beautician.findOne({ phone_no: phone_no });
        if (beauticianLogin) {
            const isMatch = await bcrypt.compare(password, beauticianLogin.password);

            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Credentials!" });
            } else {
                const token = await beauticianLogin.generateAuthToken();
                console.log("token:", token);
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now + 25892000000),
                    httpOnly: true,
                });
                return res.redirect("/beautician/appointment");
            }
        } else {
            return res.status(400).json({ error: "Invalid Credentials!" });
        }
    } catch (err) {
        console.log(err);
    }
});
module.exports = beauticianRouter;