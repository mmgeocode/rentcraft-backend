// Endpoint: http://localhost:4000/payments

// TODO: add tenant_id and unit_ids to test
// TODO: make payment amount pull from unit

const router = require("express").Router();

const Payments = require("../models/payments.model");

const Tenants = require("../models/tenants.model")

const Unit = require("../models/unit.model")

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const validateSession = require("../middleware/validate-session")

/* 
    * Create a payment
    * Endpoint: http://localhost:4000/payments/create/:tenantid
    * Request: POST
*/

router.post("/create/:unitid", validateSession, async (req, res) => {

    try {

        const payment = new Payments({
            unit_id: req.params.unitid,
            tenant_id: req.body.tenant_id,
            date: req.body.date,
            amount: req.body.amount,
            paymentsState: req.body.paymentsState
        })

        const newPayment = await payment.save()

        res.json({ message: "payment created", message: newPayment})
        
    } catch (error) {

        res.status(500).json({ message: error.message })
        
    }

})

/* 
    * Get payment by id
    * Endpoint: http://localhost:4000/payments/:id
    * Request: Get
*/

router.get("/:id", validateSession, async (req, res) => {

    try {

        const payment = await Payments.findById({ _id: req.params.id })

        res.status(200).json({ payment: payment, message: "Get payment by id success" })
        
    } catch (error) {
        
        res.status(500).json({ message: error.message })

    }

})

/* 
    * View unit payment history
    * Endpoint: http://localhost:4000/payments/unit/:id
    * Request: GET
*/

router.get("/unit/:id", validateSession, async (req, res) => {

    try {

        const unit_history = await Payments.find({ unit_id: req.params.id })

        res.status(200).json({ unit_history: unit_history, message: "Get payment history by unit id success" })
        
    } catch (error) {

        res.status(500).json({ message: error.message })
        
    }

})

/* 
    * View tenant payment history
    * Endpoint: http://localhost:4000/payments/tenant/:id
    * Request: GET
*/

router.get("/tenant/:id", validateSession, async (req, res) => {

    try {

        const tenant_history = await Payments.find({ tenant_id: req.params.id })

        res.status(200).json({ tenant_history: tenant_history, message: "Get tenant payment history success" })
        
    } catch (error) {

        res.status(500).json({ message: error.message })
        
    }

})

/* 
    * Update payment
    * Endpoint: http://localhost:4000/payments/update/:id
    * Request: PATCH
*/

router.patch("/update/:id", validateSession, async (req, res) => {

    try {

        const id = req.params.id

        // ! Do we need additional IDs to update payment?
        const conditions = { _id: id }

        const data = req.body

        const options = { new: true }

        const payment = await Payments.findOneAndUpdate(conditions, data, options)

        if (!payment) {
            throw new Error("Payment can not be found")
        }

        res.json({ message: "sucessful patch", payment: payment })
        
    } catch (error) {

        res.status(500).json({ message: error.message })
        
    }

})

/* 
    * query unit id for monthly rent
    * Endpoint: http://localhost:4000/payments/rent/:unitid
    * Request: GET
*/

router.get("/rent/:unitid", validateSession, async (req, res) =>{

    try {

        const unit = await Unit.find({ _id: req.params.unitid })

        // ! FIGURE OUT HOW TO PULL VALUE FROM OBJECT PROPERTY

        const rent = unit.filter((value) => value.monthlyRent >= 0)

        res.status(200).json({ rent: rent, message: "Get unit by id success - need to find rent value" })
        
    } catch (error) {

        res.status(500).json({ message: error.message })
        
    }
})

module.exports = router;