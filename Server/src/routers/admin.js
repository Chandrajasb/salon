const express = require("express");
const adminRouter = express.Router();
require("../db/conn");
const Admin = require("../models/adminSchema");
const Service = require("../models/serviceSchema");
adminRouter.use(express.json());
const adminAuthenticate = require("../middleware/adminAuthenticate");
const Appointment = require("../models/appointmentSchema");

adminRouter.get("/adminLogin", (req, res) => {
  res.render("adminLogin");
});

adminRouter.get("/addservice", (req, res) => {
  res.render("addservice");
});

adminRouter.get("/adminpage", adminAuthenticate, async (req, res) => {
  try {
    const Services = await Service.find();
    if (!Services) {
      throw new Error("Services not found");
    }
    const maleServices = await Service.find({ gender: "male" });
    if (!maleServices) {
      throw new Error("MaleServices not found");
    }
    const femaleServices = await Service.find({ gender: "female" });
    if (!femaleServices) {
      throw new Error("FemaleServices not found");
    }
    const appointments = await Appointment.find();
    if (!appointments) {
      throw new Error("Appointments not found");
    }
    const appointmentsMale = await Appointment.find({ gender: "male" });
    if (!appointmentsMale) {
      throw new Error("Appointments not found");
    }
    const appointmentsFemale = await Appointment.find({ gender: "female" });
    if (!appointmentsFemale) {
      throw new Error("Appointments not found");
    }
    const ServicesCount = Services.length;
    const maleServicesCount = maleServices.length;
    const femaleServicesCount = femaleServices.length;
    const appointmentsCount = appointments.length;
    const appointmentsMaleCount = appointmentsMale.length;
    const appointmentsFemaleCount = appointmentsFemale.length;
    console.log(ServicesCount);
    console.log(maleServicesCount);
    console.log(femaleServicesCount);
    console.log(appointmentsCount);
    console.log(appointmentsMaleCount);
    console.log(appointmentsFemaleCount);
    res.render("adminpage", {
      maleServicesCount: maleServicesCount,
      femaleServicesCount: femaleServicesCount,
    });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

adminRouter.get("/Services", adminAuthenticate, async (req, res) => {
  try {
    const maleServices = await Service.find({ gender: "male" });
    if (!maleServices) {
      throw new Error("MaleServices not found");
    }
    const femaleServices = await Service.find({ gender: "female" });
    if (!femaleServices) {
      throw new Error("FemaleServices not found");
    }
    console.log(maleServices);
    console.log(femaleServices);
    res.render("addServices");
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

adminRouter.post("/addService", adminAuthenticate, async (req, res) => {
  const { serviceName, cost, gender } = req.body;
  try {
    const service = new Service({
      serviceName,
      cost,
      gender,
    });
    await service.save();
    res.status(201).render("addService");
  } catch (err) {
    console.log(err);
  }
});

adminRouter.get("/admin/appointment", adminAuthenticate, async (req, res) => {
  try {
    const appointmentsMale = await Appointment.find({ gender: "male" });
    if (!appointmentsMale) {
      throw new Error("Appointments not found");
    }
    const appointmentsFemale = await Appointment.find({ gender: "female" });
    if (!appointmentsFemale) {
      throw new Error("Appointments not found");
    }
    console.log(appointmentsMale);
    console.log(appointmentsFemale);
    // res.render("appointment", { blog: appointment });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

adminRouter.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Fill both the fields" });
    }
    const adminLogin = await Admin.findOne({
      email: email,
      password: password,
    });
    if (adminLogin) {
      const token = await adminLogin.generateAuthToken();
      console.log("token:", token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now + 25892000000),
        httpOnly: true,
      });
      return res.redirect("/adminpage");
    } else {
      return res.status(400).json({ error: "Invalid Credentials!" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = adminRouter;
