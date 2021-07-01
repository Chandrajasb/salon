require('dotenv').config();
const express= require('express');
const path= require('path');
const app=express();
const PORT =process.env.PORT||3000;
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


app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`);
})


