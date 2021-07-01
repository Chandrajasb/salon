require('dotenv').config();
const express= require('express');
const path= require('path');
const app=express();
const PORT =process.env.PORT;
require('./db/conn');
const template_path = path.join(__dirname, "../templates/views");
const static_path = path.join(__dirname, "../public");
const User = require("./models/userSchema");

app.use(express.json());
app.use(express.urlencoded({ extend: false }));

app.set('view engine','ejs');
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

app.post('/signup', async (req, res) => {
    try {
        const regUser = new User({
            name: req.body.name,
            email: req.body.email,
            phone_no: req.body.phone_no,
            password: req.body.password
        })
        const signedin = await regUser.save()
        res.status(201).send("SignUp Successfull!");

    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/login', async (req, res) => {
    try {
        const phone_no = req.body.phone_no;
        const password = req.body.password;
        const userphone = await User.findOne({ phone_no, password })
        if (!userphone) {
            res.status(400).send("Invalid Credentials!")
        }
        else {
            res.status(201).send("Login Successfull!")
        }

    } catch (error) {
        res.status(400).send(error)
    }
})


app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`);
})


