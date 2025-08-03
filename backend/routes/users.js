const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/users/email/:email → fetch user by email
router.get("/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("❌ Error fetching user by email:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
