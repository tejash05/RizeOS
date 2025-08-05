const express = require("express");
const router = express.Router();
const { createJob } = require("../controllers/jobController");
const auth = require("../middlewares/authMiddleware");
const Job = require("../models/Job");
const User = require("../models/User");
const OpenAI = require("openai");
const fetch = require("node-fetch"); // ✅ Required to call external API

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * ✅ Create a new job post
 */
router.post("/create", auth, createJob);

/**
 * ✅ Fetch all jobs (most recent first)
 */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    console.error("Fetch jobs error:", err);
    res.status(500).json({ msg: "Error fetching jobs" });
  }
});

/**
 * ✅ AI-Powered Feed with Match Score via Flask API
 */
router.get("/feed", async (req, res) => {
  const { userEmail } = req.query;
  if (!userEmail) return res.status(400).json({ msg: "Missing userEmail" });

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const jobs = await Job.find();
    const results = [];

    for (const job of jobs) {
      try {
        const mlRes = await fetch("https://rizeos-ml-production.up.railway.app/match-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobDescription: job.description,
            candidateBio: user.bio || "",
            candidateSkills: (user.skills || []).join(", "),
          }),
        });

        const data = await mlRes.json();
        results.push({
          job,
          matchScore: data.score || 0,
        });
      } catch (err) {
        console.warn(`⚠️ Failed to compute match for job ${job._id}:`, err.message);
        results.push({ job, matchScore: 0 });
      }
    }

    // Sort and mark top match
    results.sort((a, b) => b.matchScore - a.matchScore);
    if (results.length > 0) results[0].recommended = true;

    res.json(results);
  } catch (err) {
    console.error("❌ ML Feed error:", err.message);
    res.status(500).json({ msg: "Server error generating ML feed" });
  }
});

module.exports = router;
