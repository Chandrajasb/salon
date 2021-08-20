const jwt = require("jsonwebtoken");
const Beautician = require("../models/beauticianSchema");

const beauticianAuthenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootBeautician = await Beautician.findOne({
            _id: verifyToken._id,
            "tokens.token": token,
        });
        if (!rootBeautician) {
            throw new Error("Beautician not found");
        }
        else {
            console.log("found");
        }
        req.token = token;
        req.rootBeautician = rootBeautician;
        req.beauticianID = rootBeautician._id;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(err);
    }
};
module.exports = beauticianAuthenticate;