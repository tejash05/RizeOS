const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");

// POST /api/applications/apply
router.post("/apply", async (req, res) => {
  const { userId, jobId } = req.body;
  console.log("📥 Apply request received:", { userId, jobId });

  try {
    if (!userId || !jobId) {
      console.log("❌ Missing userId or jobId in request");
      return res.status(400).json({ msg: "userId and jobId are required" });
    }

    const existing = await Application.findOne({ userId, jobId });
    if (existing) {
      console.log("⚠️ Already applied for this job");
      return res.status(400).json({ msg: "Already applied." });
    }

    const newApp = new Application({ userId, jobId });
    await newApp.save();

    console.log("✅ Application saved successfully:", newApp);
    res.status(201).json({ msg: "Application recorded." });
  } catch (err) {
    console.error("❌ Apply error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/applications/:userId
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("📤 Fetching applications for userId:", userId);

  try {
    const applications = await Application.find({ userId }).populate("jobId");
    console.log("🟢 Applications found:", applications.length);

    const formatted = applications.map((app) => ({
    _id: app._id,
    jobId: app.jobId?._id,
    title: app.jobId?.title || "Deleted Job",
    location: app.jobId?.location || "Unknown",
    budget: app.jobId?.budget || 0,
    tags: app.jobId?.tags || [],
}));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Fetch applications error:", err);
    res.status(500).json({ msg: "Error fetching applications" });
  }
});

module.exports = router;
