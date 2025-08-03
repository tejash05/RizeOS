const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const auth = require("../middlewares/authMiddleware");

// ✅ Save payment log
router.post("/log", auth, async (req, res) => {
  try {
    console.log("🔁 Incoming Payment Log Request...");
    console.log("🧾 Request Body:", req.body);
    console.log("🔐 Authenticated User ID:", req.user);

    const { jobId, txHash, wallet, amount, status } = req.body;

    if (!jobId || !txHash || !wallet || !amount) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    // Optional: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    const payment = new Payment({
      user: req.user,
      job: jobId,
      txHash,
      wallet,
      amount,
      status: status || "success",
    });

    await payment.save();
    console.log("✅ Payment successfully saved.");
    res.status(201).json({ msg: "Payment logged", payment });
  } catch (err) {
    console.error("💥 Payment log error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Get all payments by user
router.get("/my", auth, async (req, res) => {
  try {
    console.log("📦 Fetching payments for user:", req.user);

    const payments = await Payment.find({ user: req.user })
      .populate("job", "title")
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (err) {
    console.error("💥 Fetch payment logs error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
