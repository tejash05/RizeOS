const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    txHash: { type: String, required: true },
    wallet: { type: String, required: true },
    amount: { type: Number, required: true }, // in ETH
    status: { type: String, enum: ["success", "failed"], default: "success" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
