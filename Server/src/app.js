require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT;
//Bcrypt password
const bcrypt = require("bcryptjs");
//cookie-parser
const cookieParser = require("cookie-parser");
require("./db/conn");
const template_path = path.join(__dirname, "../templates/views");
const static_path = path.join(__dirname, "../public");
const User = require("./models/userSchema");
const Authenticate = require("./middleware/authenticate");
const Appointment = require("./models/appointmentSchema");
const Service = require("./models/serviceSchema");
const AppointmentSalon = require("./models/appointmentSalonSchema");
const Contact = require("./models/contactSchema");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extend: false }));

app.set("view engine", "ejs");
app.use(express.static(static_path));
app.use(require("./routers/admin"));
console.log(static_path);

app.set("views", template_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/contactus", (req, res) => {
  res.render("contactus");
});
app.get("/aboutus", (req, res) => {
  res.render("aboutus");
});

app.get("/heuser", Authenticate, (req, res) => {
  res.render("heuser", { name: "name" });
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/dapp", Authenticate, async (req, res) => {
  const phone = req.rootUser.phone_no;
  try {
    const appointments = await Appointment.find({ phone: phone });
    if (!appointments) {
      throw new Error("User not found");
    }
    console.log(appointments);
    const appointmentsSalon = await AppointmentSalon.find({ phone: phone });
    if (!appointmentsSalon) {
      throw new Error("User not found");
    }
    console.log(appointmentsSalon);
    res.render("dapp", { dapp: appointments, dapp2: appointmentsSalon });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

app.get("/appointment", Authenticate, async (req, res) => {
  try {
    const gender = req.rootUser.gender;
    const services = await Service.find({ gender: gender });
    if (!services) {
      throw new Error("Services not found");
    }
    console.log(services);
    res.render("appointment", { profile: req.rootUser, services: services });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});
app.get("/appointmentSalon", Authenticate, async (req, res) => {
  try {
    const gender = req.rootUser.gender;
    const services = await Service.find({ gender: gender });
    if (!services) {
      throw new Error("Services not found");
    }
    console.log(services);
    res.render("appointmentSalon", {
      profile: req.rootUser,
      services: services,
    });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});

app.post("/bookappointment", Authenticate, async (req, res) => {
  const gender = req.rootUser.gender;
  const { name, phone, date, time, service, address } = req.body;
  try {
    const appointment = new Appointment({
      name,
      phone,
      gender,
      date,
      time,
      service,
      address,
    });
    await appointment.save();
    res.redirect("dapp");
  } catch (err) {
    console.log(err);
  }
});
app.post("/bookappointmentSalon", Authenticate, async (req, res) => {
  const gender = req.rootUser.gender;
  const { name, phone, date, time, service } = req.body;
  try {
    const appointment = new AppointmentSalon({
      name,
      phone,
      gender,
      date,
      time,
      service,
    });
    await appointment.save();
    res.redirect("dapp");
  } catch (err) {
    console.log(err);
  }
});

app.post("/signup", async (req, res) => {
  const { name, phone_no, email, gender, password, cpassword } = req.body;
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ Error: "User already Exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ Error: "Passwords are not matching " });
    } else {
      const regUser = new User({ name, phone_no, email, gender, password });
      await regUser.save();
      res.status(201).render("login");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { phone_no, password } = req.body;
    if (!phone_no || !password) {
      return res.status(400).json({ error: "Fill both the fields" });
    }
    const userLogin = await User.findOne({ phone_no: phone_no });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid Credentials!" });
      } else {
        const token = await userLogin.generateAuthToken();
        console.log("token:", token);
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now + 25892000000),
          httpOnly: true,
        });
        if (userLogin.gender == "male")
          return res.status(201).render("heuser", { name: userLogin.name });
        if (userLogin.gender == "female")
          return res.status(201).render("sheuser", { name: userLogin.name });
      }
    } else {
      return res.status(400).json({ error: "Invalid Credentials!" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/services", Authenticate, async (req, res) => {
  try {
    const gender = req.rootUser.gender;
    const Services = await Service.find({ gender: gender });
    if (!Services) {
      throw new Error("Services not found");
    }
    console.log(Services);
    return res
      .status(201)
      .render("userservices", { Services: Services, gender: gender });
  } catch (err) {
    res.status(401).send("Unauthorized:No token provided");
    console.log(err);
  }
});
//contactus Route
app.post("/contactus", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
//Logout User
//----------------
app.get("/logout", (req, res) => {
  console.log("Hello from Logout");
  res.clearCookie("jwtoken");
  // res.status(200).send("Logout User");
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running at port no ${PORT}`);
});
