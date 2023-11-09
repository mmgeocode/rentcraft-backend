// Endpoint: http://localhost:4000/user

const router = require("express").Router();

const User = require("../models/user.model");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const validateSession = require("../middleware/validate-session");

/* 
    * Create new login
    * Endpoint: http://localhost:4000/user/create
    * Request Type: POST
*/ 

router.post("/create", async (req, res) => {

    try {

        const { firstName, lastName, email, password } = req.body

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: bcrypt.hashSync(password, 10)
        })

        const newUser = await user.save()

        // ! JWT expires in 30 days * 24 hours * 60 minutes * 60 seconds
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: 30*24*60*60 })

        res.json({ message: "Welcome to RentCraft", user: newUser, token: token })
        
    } catch (error) {

        res.status(500).json({ message: error.message })

    }
})

/* 
    * user login
    * http://localhost:4000/user/login
    * Request: POST
*/

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email: email })

        // error if user doesn't exist
        if (!user) {
            throw new Error("User not found")
        }

        // password check
        const isPasswordAMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordAMatch) {
            throw new Error("Incorrect password")
        }

        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 30*24*60*60 })

        res.json({ message: `Welcome ${user.firstName}`, user: user, token: token })
        
    } catch (error) {

        res.status(500).json({ message: error.message })
        
    }
})

/* 
    * Get user by id
    * Endpoint: http://localhost:4000/user/:id
    * Request: GET
*/

router.get("/:id", validateSession, async (req, res) => {

    try {

        const user = await User.findById({ _id: req.params.id })

        if (!user) {
            throw new Error("User not found")
        }

        res.status(200).json({ user: user, message: "user found"})
        
    } catch (error) {

        res.status(500).json({ message: error.message })
        
    }
})

/* 
    * Patch user
    * Endpoint: http://localhost:4000/user/update/:id
    * Request: PATCH
*/

router.patch("/update/:id", validateSession, async (req, res) => {

    try {

        const conditions = {_id: req.user._id} 
        const data = req.body; 
        const options = {new: true}; 

        const user = await User.findOneAndUpdate(conditions, data, options)

        if (!user) {
            throw new Error("Failed to update")
        }

        res.json({ message: "patch successful", user: user })
        
    } catch (error) {

        res.status(500).json({ message: error.message })
        
    }

})

/* 
    * Delete user
    * Endpoint: http://localhost:4000/user/delete/:id
    * Request: DELETE
*/

router.delete("/delete/:id", validateSession, async (req, res) => {

    try {

        const id = req.params.id

        const user = await User.deleteOne({ _id: id})

        res.json({ message: user.deletedCount === 1 ? "User deleted" : "Error: user not deleted" })
        
    } catch (error) {
        
        res.status(500).json({ message: error.message })

    }

})

module.exports = router;