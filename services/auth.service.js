//? do I need this if I have a login/signup already?

const router = require("express").Router();
const JWT = require("jsonwebtoken") 
const User = require("../models/user.model") 
const Token = require("../models/token.model") 
const sendEmail = require("../controllers/contacts") 
const crypto = require("crypto") 
const bcrypt = require("bcrypt") 


const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;


// router.post("/auth/resetPassword", resetPasswordController); 

router.post('/requestPasswordReset/:email', async (req, res) => { 
  const { email } = req.body
     //check if user exists 
 //check if there is an existing token 
 //delete token 
  try {
    const user = await User.findOne({ email });
    if (!user) { throw new Error("Email does not exist") }
    
    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();
  
    let resetToken = crypto.randomBytes(32).toString("hex");

    //!saving plain resetToken is a security concern 
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt)); 

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save() 
} catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}

  //reset password link
  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
  sendEmail(user.email,"Password Reset Request",{name: user.firstName,link: link,},"./template/requestResetPassword.handlebars");
  return { link }; 
}) 

router.post("/auth/resetPassword", async (userId, token, password) => {
    let passwordResetToken = await Token.findOne({ userId });
  
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }
  
    console.log(passwordResetToken.token, token);
  
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
  
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }
  
    const hash = await bcrypt.hash(password, Number(bcryptSalt)); 

    await User.updateOne(
        { _id: userId },
        { $set: { password: hash } },
        { new: true }
      ); 

      const user = await User.findById({ _id: userId }) 

      sendEmail(
        user.email,
        "Password Reset Successfully",
        {
          name: user.firstName,
        },
        "./template/resetPassword.handlebars"
      );
    
      await passwordResetToken.deleteOne();
    
      return { message: "Password reset was successful" };
    })

//make endpoints that call two functions 
//make sure to fetch the email for both postmans to work
module.exports = router;
