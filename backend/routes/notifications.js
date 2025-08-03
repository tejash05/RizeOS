const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET /api/notifications/global
router.get("/global", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(3);
    res.json({ notifications: jobs });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching notifications" });
  }
});

module.exports = router;

