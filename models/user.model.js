const mongoose = require("mongoose") 
const bcrypt = require("bcrypt") 
const Schema = mongoose.Schema;
const bcryptSalt = process.env.BCRYPT_SALT;

const UserSchema = new mongoose.Schema({

    firstName: {
        type: String, 
        trim: true,
    },
    lastName: {
        type: String, 
        trim: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
    },
    password: {
        type: String,
        required: true, 
    }, 
},
/* {
    timestamps: true
} */
); 

/* UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
    this.password = hash;
    next();
  }); */

module.exports = mongoose.model("User", UserSchema);