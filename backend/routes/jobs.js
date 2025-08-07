const express = require("express");
const router = express.Router();
const { createJob } = require("../controllers/jobController");
const auth = require("../middlewares/authMiddleware");
const Job = require("../models/Job");
const User = require("../models/User");

// ✅ Create a new job post (requires authentication)
router.post("/create", auth, createJob);

/**
 * 📄 Fetch all jobs
 * GET /api/jobs/
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
 * 🧠 AI-Powered Feed with optional Match Scores
 * GET /api/jobs/feed?userEmail=...&withScores=true
 */
router.get("/feed", async (req, res) => {
  console.time("🔥 Total feed time");

  const { userEmail, withScores } = req.query;
  if (!userEmail) return res.status(400).json({ msg: "Missing userEmail" });

  try {
    // Step 1: Fetch user profile
    console.time("⏱️ User fetch");
    const user = await User.findOne({ email: userEmail }).lean();
    console.timeEnd("⏱️ User fetch");

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Step 2: Fetch latest job posts
    console.time("⏱️ Job fetch");
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(25).lean();
    console.timeEnd("⏱️ Job fetch");

    if (!jobs.length) return res.json([]);

    // If scores are not requested, return jobs directly
    if (withScores !== "true") {
      console.log("⚡ Returning jobs without ML match scores");
      console.timeEnd("🔥 Total feed time");
      return res.json({ jobs });
    }

    // Step 3: Clean user + job data before sending to ML API
    console.log(`📦 ML scoring requested for ${jobs.length} jobs...`);

    const cleanText = (text, max = 1000) => {
      if (!text) return "";
      return String(text).trim().slice(0, max);
    };

    const cleanArray = (arr, maxItems = 10) => {
      if (!Array.isArray(arr)) return [];
      return arr
        .filter((item) => typeof item === "string" && item.trim() !== "")
        .map((item) => item.trim())
        .slice(0, maxItems);
    };

    const candidateBio = cleanText(user.bio, 1000);
    const candidateSkills = cleanArray(user.skills);

    console.time("🧠 Preparing batch input");
    const batchInput = jobs.map((job) => ({
      jobDescription: cleanText(job.description, 1500),
      jobSkills: cleanArray(job.skills),
      candidateBio,
      candidateSkills,
    }));
    console.timeEnd("🧠 Preparing batch input");

    // Step 4: Call external ML API
    console.time("📡 ML API Call");
    const flaskRes = await fetch(`${process.env.ML_API_URL}/match-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batchInput),
    });
    console.timeEnd("📡 ML API Call");

    const mlResults = await flaskRes.json();

    if (!Array.isArray(mlResults)) {
      console.error("❌ Invalid ML API response:", mlResults);
      return res.status(500).json({ msg: "Invalid response from ML model" });
    }

    // Step 5: Merge job data with match scores
    const results = jobs.map((job, idx) => ({
      job,
      matchScore: mlResults[idx]?.score || 0,
    }));

    // Step 6: Sort and mark top recommendation
    results.sort((a, b) => b.matchScore - a.matchScore);
    if (results.length > 0) results[0].recommended = true;

    console.timeEnd("🔥 Total feed time");
    res.json(results);
  } catch (err) {
    console.error("❌ ML Feed error:", err.message);
    res.status(500).json({ msg: "Server error generating ML feed" });
  }
});

module.exports = router;
