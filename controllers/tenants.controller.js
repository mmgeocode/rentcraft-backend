// Endpoint: http://localhost:4000/tenants

const router = require("express").Router();

const Tenants = require("../models/tenants.model");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const validateSession = require("../middleware/validate-session");

/*
 * Create new tenant
 * Endpoint: http://localhost:4000/tenant/register
 * Request Type: POST
 */

router.post("/register", validateSession, async (req, res) => {
  try {
    const { firstName, lastName, phone, email, active } = req.body;
    const tenant = new Tenants({
      user_id: req.user._id,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      active: true,
    });

    const newTenant = await tenant.save();

    res.json({ message: "Tenant Registration Complete", tenant: newTenant });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
 * View Tenants
 * Endpoint: http://localhost:4000/tenant/view-all
 * Request Type: Get
 */

router.get("/view-all/:id", validateSession, async (req, res) => {
  try {
    const user_tenants = await Tenants.find({
      user_id: req.params.id,
    }).populate("firstName");
    res.json({ message: "Tenants Retrieved", user_tenants: user_tenants });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
 * View Tenant by Id
 * Endpoint: http://localhost:4000/tenant/find-tenant/:id
 * Request Type GET
 */

router.get("/find-tenant/:id", validateSession, async (req, res) => {
  try {
    const id = req.params.id;

    const tenants = await Tenants.findById(id).populate("firstName");

    res.json({ message: "Tenant Retrieved", tenants: tenants });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
 * Update Tennant Info
 * Endpoint: http://localhost:4000/tenant/update/:id
 * Request Type: Patch
 */

router.patch("/update/:id", validateSession, async (req, res) => {
  try {
    const id = req.params.id;
    const conditions = { _id: id };
    const data = req.body;
    const options = { new: true };

    const tenants = await Tenants.findOneAndUpdate(conditions, data, options);

    if (!tenants) {
      throw new Error("Tenant not found");
    }
    res.json({
      message: "Success from Update",
      tenants: tenants,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
 * Delete Tenant Info
 * Endpoint: http://localhost:4000/tenant/delete/:id
 * Request Type: Patch
 */

router.delete("/delete/:id", validateSession, async (req, res) => {
  try {
    const id = req.params.id;
    const conditions = {
      _id: id,
    };
    const tenants = await Tenants.deleteOne({ _id: id });
    res.json({
      message:
        tenants.deletedCount === 1
          ? "Tenant was Deleted"
          : "Error, Could not Delete Tenant",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;

/* 
http://localhost:4000/tenant/register
http://localhost:4000/tenant/view-all
http://localhost:4000/tenant/find-tenant/:id
http://localhost:4000/tenant/update/:id
http://localhost:4000/tenant/delete/:id
ownerId: req.user._id
*/
