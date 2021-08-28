const express = require("express");
const adminRouter = express.Router();
require("../db/conn");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const Service = require("../models/serviceSchema");
const Beautician = require("../models/beauticianSchema");
adminRouter.use(express.json());
const adminAuthenticate = require("../middleware/adminAuthenticate");
const Appointment = require("../models/appointmentSchema");
const AppointmentSalon = require("../models/appointmentSalonSchema");
const Contact = require("../models/contactSchema");
const methodOverride = require("method-override");
adminRouter.use(methodOverride("_method"));

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
    const appointmentsSalon = await AppointmentSalon.find();
    if (!appointmentsSalon) {
      throw new Error("Appointments not found");
    }
    const appointmentsMaleSalon = await AppointmentSalon.find({ gender: "male" });
    if (!appointmentsMaleSalon) {
      throw new Error("Appointments not found");
    }
    const appointmentsFemaleSalon = await AppointmentSalon.find({ gender: "female" });
    if (!appointmentsFemaleSalon) {
      throw new Error("Appointments not found");
    }
    const ServicesCount = Services.length;
    const maleServicesCount = maleServices.length;
    const femaleServicesCount = femaleServices.length;
    const appointmentsCount = appointments.length;
    const appointmentsMaleCount = appointmentsMale.length;
    const appointmentsFemaleCount = appointmentsFemale.length;
    const appointmentsSalonCount = appointmentsSalon.length;
    const appointmentsMaleSalonCount = appointmentsMaleSalon.length;
    const appointmentsFemaleSalonCount = appointmentsFemaleSalon.length;
    console.log(ServicesCount);
    console.log(maleServicesCount);
    console.log(femaleServicesCount);
    console.log(appointmentsCount);
    console.log(appointmentsMaleCount);
    console.log(appointmentsFemaleCount);
    console.log(appointmentsSalonCount);
    console.log(appointmentsMaleSalonCount);
    console.log(appointmentsFemaleSalonCount);
    let totalCount = [maleServicesCount, femaleServicesCount]
    let totalAppointmentsCount = [appointmentsCount, appointmentsSalonCount]
    let separatedAppointmentsCount = [appointmentsMaleSalonCount, appointmentsFemaleSalonCount, appointmentsMaleCount, appointmentsFemaleCount]
    res.render("adminpage", {
      maleServicesCount: maleServicesCount,
      femaleServicesCount: femaleServicesCount,
      totalCount: totalCount,
      totalAppointmentsCount: totalAppointmentsCount,
      separatedAppointmentsCount: separatedAppointmentsCount,
    });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

adminRouter.get("/listServices", adminAuthenticate, async (req, res) => {
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
    res.render("admin-listservice", {
      maleServices: maleServices,
      femaleServices: femaleServices,
    });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});


adminRouter.get("/addBeautician", adminAuthenticate, async (req, res) => {
  try {
    const beautician = await Beautician.find();
    if (!beautician) {
      throw new Error("Beautician not found");
    }
    console.log(beautician);
    res.status(201).render("admin-beautician", { beautician: beautician });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

adminRouter.post("/addBeautician", adminAuthenticate, async (req, res) => {
  const { name, email, phone_no, gender, password, address } = req.body;
  try {
    const beautician = new Beautician({
      name, email, phone_no, gender, password, address
    });
    await beautician.save();
    res.redirect("/addBeautician");
  } catch (err) {
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

adminRouter.get("/admin/appointmentSalon", adminAuthenticate, async (req, res) => {
  try {
    const appointmentsSalon = await AppointmentSalon.find();
    if (!appointmentsSalon) {
      throw new Error("Appointments not found");
    }
    // const appointmentsFemaleSalon = await AppointmentSalon.find({ gender: "female" });
    // if (!appointmentsFemaleSalon) {
    //   throw new Error("Appointments not found");
    // }
    console.log(appointmentsSalon);

    res.render("admin-appointmentsSalon", { appointmentsSalon: appointmentsSalon });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

adminRouter.get("/admin/appointmentPendingSalon", adminAuthenticate, async (req, res) => {
  try {
    const appointmentspendingSalon = await AppointmentSalon.find({ status: "pending" });
    if (!appointmentspendingSalon) {
      throw new Error("Appointments not found");
    }
    console.log(appointmentspendingSalon);

    res.render("admin-appointmentPendingSalon", { appointmentspendingSalon: appointmentspendingSalon });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

adminRouter.get("/admin/appointmentPending", adminAuthenticate, async (req, res) => {
  try {
    const appointmentspending = await Appointment.find({ status: "pending" });
    const beautician = await Beautician.find();
    if (!appointmentspending) {
      throw new Error("Appointments not found");
    }
    console.log(appointmentspending);

    res.render("admin-appointmentPending", { appointmentspending: appointmentspending, beautician: beautician });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

adminRouter.get("/admin/appointment", adminAuthenticate, async (req, res) => {
  try {
    const appointments = await Appointment.find();
    const beautician = await Beautician.find();
    if (!appointments) {
      throw new Error("Appointments not found");
    }

    console.log(appointments);

    res.render("admin-appointments", { appointments: appointments, beautician: beautician });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});
adminRouter.get("/feedbacks", adminAuthenticate, async (req, res) => {
  try {
    const feebacks = await Contact.find();
    if (!feebacks) {
      throw new Error("Feebacks not found");
    }
    console.log(feebacks);
    res.render("admin-contact", { feebacks: feebacks });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

adminRouter.get("/userlist", adminAuthenticate, async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      throw new Error("User not found");
    }
    console.log(user);
    res.render("admin-user", { users: user });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});
//Edit Service
adminRouter.put("/editService/:id", adminAuthenticate, async (req, res) => {
  try {
    const _id = req.params.id;
    const service = await Service.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.redirect("/listServices");
    console.log(service);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Edit Appointment
adminRouter.put("/editAppointment/:id", adminAuthenticate, async (req, res) => {
  try {
    const _id = req.params.id;
    const appointment = await Appointment.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.redirect("/admin/appointmentPending");
    console.log(appointment);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Edit Appointment salon
adminRouter.put("/editAppointmentSalon/:id", adminAuthenticate, async (req, res) => {
  try {
    const _id = req.params.id;
    console.log(req.body);
    const appointmentSalon = await AppointmentSalon.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.redirect("/admin/appointmentPendingSalon");
    console.log(appointmentSalon);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Delete Service
adminRouter.delete("/deleteService/:id", adminAuthenticate, async (req, res) => {
  try {
    const _id = req.params.id;
    const service = await Service.findByIdAndDelete(_id);
    res.redirect("/listServices");
    console.log(service);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Delete Beautician
adminRouter.delete("/deleteBeautician/:id", adminAuthenticate, async (req, res) => {
  try {
    const _id = req.params.id;
    const beautician = await Beautician.findByIdAndDelete(_id);
    res.redirect("/addBeautician");
    console.log(beautician);
  } catch (err) {
    res.status(500).send(err);
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
