require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT;
//Bcrypt password
const bcrypt = require("bcryptjs");
//cookie-parser 
const cookieParser = require("cookie-parser");
require('./db/conn');
const template_path = path.join(__dirname, "../templates/views");
const static_path = path.join(__dirname, "../public");
const User = require("./models/userSchema");
const Authenticate = require('./middleware/authenticate');
const Appointment = require('./models/appointmentSchema');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extend: false }));

app.set('view engine', 'ejs');
app.use(express.static(static_path));
console.log(static_path);

app.set("views", template_path);

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/signup', (req, res) => {
    res.render("signup")
})

app.get('/login', (req, res) => {
    res.render("login")
})
app.get('/dapp', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        console.log(appointments);
        if (!appointments) {
            throw new Error("User not found");
        }
        res.render("dapp", { "dapp": appointments })
    } catch (err) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(err);
    }
})

app.get('/appointment', Authenticate, async (req, res) => {
    try {
        const phone_no = req.rootUser.phone_no;
        const user = await User.find({ phone_no: phone_no });
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        console.log(user);
        res.render("appointment", { "profile": req.rootUser })
    } catch (err) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(err);
    }
})
app.post('/bookappointment', async (req, res) => {
    const { name, phone, date, time,service, address } = req.body;
    try {
        const appointment = new Appointment({ name, phone, date, time,service, address });
        await appointment.save();
        res.status(201).render('index');

    } catch (err) {
        console.log(err);
    }
})

app.post('/signup', async (req, res) => {
    const { name, phone_no, email, password, cpassword } = req.body;
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ Error: "User already Exists" });
        } else if (password != cpassword) {
            return res.status(422).json({ Error: "Passwords are not matching " });
        } else {
            const regUser = new User({ name, phone_no, email, password });
            await regUser.save();
            res.status(201).render('login');
        }
    } catch (err) {
        console.log(err);
    }
})

app.post('/login', async (req, res) => {
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
                return res.status(201).render('index');
            }
        } else {
            return res.status(400).json({ error: "Invalid Credentials!" });
        }
    } catch (err) {
        console.log(err);
    }

})


app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`);
})


