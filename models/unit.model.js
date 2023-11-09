const mongoose = require("mongoose");
//the characteristics that every unit will have

const UnitSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },

  tenant_id: {
    type: mongoose.Types.ObjectId,
    ref: "Tenants",
  },

  address: {
    type: String,
    required: true,
    unique: true,
  },

  city: {
    type: String,
  },

  state: {
    type: String,
  },

  zip: {
    type: Number,
  },

  monthlyRent: {
    type: Number,
  },

  unitState: {
    type: String,
  },
});

module.exports = mongoose.model("Unit", UnitSchema);
