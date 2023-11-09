// Endpoint: http://localhost:4000/unit

const router = require("express").Router();

const Unit = require("../models/unit.model");

const validateSession = require("../middleware/validate-session");

/* 
endpoint: http://localhost:4000/unit/create
request type: POST
user automatically becomes the owner_id, we can add more owner_id with an array function 
*/

router.post("/create", validateSession, async (req, res) => {
  try {
    const {
      user_id,
      tenant_id,
      address,
      city,
      state,
      zip,
      monthlyRent,
      unitState,
    } = req.body;

    const unit = new Unit({
      user_id: req.user._id,
      tenant_id: req.tenant_id,
      address: address,
      city: city,
      state: state,
      zip: zip,
      monthlyRent: monthlyRent,
      unitState: unitState,
    });
    const newUnit = await unit.save();
    res.json({
      message: "Unit created:",
      unit: newUnit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* 
endpoint: http://localhost:4000/unit/view-all
request type: GET
view all the units a user has 
*/

router.get("/view-all", validateSession, async (req, res) => {
  try {
    const units = await Unit.find();
    res.json({
      message: "Viewing all units:",
      units: units,
      userId: req.user._id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* 
endpoint: http://localhost:4000/unit/view-by-id/:id
request type: GET
view all the units a user has 
*/

router.get("/view-by-id/:id", validateSession, async (req, res) => {
  try {
    const id = req.params.id;
    const unit = await Unit.findById(id);
    res.json({ message: "Unit found:", unit: unit });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* 
endpoint: http://localhost:4000/unit/delete/:id
request type: DELETE
view all the units a user has 
*/

router.delete("/delete/:id", validateSession, async (req, res) => {
  try {
    const id = req.params.id;
    const conditions = {
      _id: id,
      ownerId: req.user._id,
    };
    const unit = await Unit.deleteOne({ _id: id });
    console.log(unit);
    res.json({
      message:
        unit.deletedCount === 1
          ? "Unit deleted successfully"
          : "Failure to delete unit",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* 
endpoint: http://localhost:4000/unit/update/:id
request type: PATCH
view all the units a user has 
*/

router.patch("/update/:id", validateSession, async function (req, res) {
  try {
    const id = req.params.id;
    const conditions = { _id: id, user_id: req.user._id }; // ensures the updating person is the correct user
    let {
      user_id,
      tenant_id,
      address,
      city,
      state,
      zip,
      monthlyRent,
      unitState,
    } = req.body;

    const options = { new: true };
    const data = {
      user_id,
      tenant_id,
      address,
      city,
      state,
      zip,
      monthlyRent,
      unitState,
    };

    const unit = await Unit.findOneAndUpdate(conditions, data, options);

    if (!unit) {
      throw new Error("Unit was not found");
    }

    res.json({
      message: "Unit updated",
      unit: unit,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
