const jwt = require("jsonwebtoken"); 
const User = require("../models/user.model") 
const Tenants = require("../models/tenants.model")

const validateSession = async (req, res, next) => {
    try {

        const token = req.headers.authorization;
    console.log("token", token); 

const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
console.log("decodedToken", decodedToken); 


const user = await User.findById(decodedToken.id); 

if(!user){
    throw new Error("user not found")
}
req.user = user;


return next();
    } catch (error) {
        res.status(500).json({message: error.message });
    }
};




module.exports = validateSession;