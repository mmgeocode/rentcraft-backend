const mongoose = require("mongoose");

const PaymentsSchema = new mongoose.Schema(
  {
    unit_id: {
      type: mongoose.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    tenant_id: {
      type: mongoose.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
    },
    amount: {
      type: Number,
      ref: "Unit",
      required: true,
    },
    paymentsState: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payments", PaymentsSchema);
