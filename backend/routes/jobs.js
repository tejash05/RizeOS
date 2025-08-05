
// const express = require("express");
// const router = express.Router();
// const { createJob } = require("../controllers/jobController");
// const auth = require("../middlewares/authMiddleware");
// const Job = require("../models/Job");
// const User = require("../models/User");
// const OpenAI = require("openai");
// const fetch = require("node-fetch"); // ✅ Required in Node.js < 18
// const { compute_match_score_with_breakdown } = require("../utils/match_score");

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// /**
//  * ✅ Create a new job post
//  */
// router.post("/create", auth, createJob);

// /**
//  * ✅ Fetch all jobs (most recent first)
//  */
// router.get("/", async (req, res) => {
//   try {
//     const jobs = await Job.find().sort({ createdAt: -1 });
//     res.json({ jobs });
//   } catch (err) {
//     console.error("Fetch jobs error:", err);
//     res.status(500).json({ msg: "Error fetching jobs" });
//   }
// });

// /**
//  * ✅ AI-Powered Feed with Match Score via match_score utils
//  */
// router.get("/feed", async (req, res) => {
//   const { userEmail } = req.query;
//   if (!userEmail) return res.status(400).json({ msg: "Missing userEmail" });

//   try {
//     const user = await User.findOne({ email: userEmail });
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     const jobs = await Job.find();
//     const results = [];

//     for (const job of jobs) {
//       try {
//         console.log(`🔁 Scoring job ${job._id} (${job.title}) for ${user.email}`);

//         const scoreObj = await compute_match_score_with_breakdown(
//           job.description,
//           job.skills || [],
//           user.bio || "",
//           user.skills || []
//         );

//         results.push({
//           job,
//           matchScore: scoreObj.score || 0,
//         });
//       } catch (err) {
//         console.warn(`⚠️ Failed to compute match for job ${job._id}:`, err.message);
//         results.push({ job, matchScore: 0 });
//       }
//     }

//     // Sort by match score descending
//     results.sort((a, b) => b.matchScore - a.matchScore);
//     if (results.length > 0) results[0].recommended = true;

//     res.json(results);
//   } catch (err) {
//     console.error("❌ ML Feed error:", err.message);
//     res.status(500).json({ msg: "Server error generating ML feed" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const { createJob } = require("../controllers/jobController");
const auth = require("../middlewares/authMiddleware");
const Job = require("../models/Job");
const User = require("../models/User");
const fetch = require("node-fetch"); // Required in Node.js < 18

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
 * ✅ AI-Powered Feed with Batch Match Score via Flask API
 */
router.get("/feed", async (req, res) => {
  const { userEmail } = req.query;
  if (!userEmail) return res.status(400).json({ msg: "Missing userEmail" });

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const jobs = await Job.find();
    console.log(`📦 Sending ${jobs.length} jobs for ${user.email} to ML model in batch...`);

    // Batch input for ML API
    const batchInput = jobs.map((job) => ({
      jobDescription: job.description,
      jobSkills: job.skills || [],
      candidateBio: user.bio || "",
      candidateSkills: user.skills || [],
    }));

    // Call Flask ML API in one batch
    const flaskRes = await fetch("https://rizeos-ml-production.up.railway.app/match-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batchInput),
    });

    const mlResults = await flaskRes.json();

    if (!Array.isArray(mlResults)) {
      console.error("❌ Invalid ML API response:", mlResults);
      return res.status(500).json({ msg: "Invalid response from ML model" });
    }

    // Combine job + score
    const results = jobs.map((job, idx) => ({
      job,
      matchScore: mlResults[idx]?.score || 0,
    }));

    // Sort by score
    results.sort((a, b) => b.matchScore - a.matchScore);
    if (results.length > 0) results[0].recommended = true;

    res.json(results);
  } catch (err) {
    console.error("❌ ML Feed error:", err.message);
    res.status(500).json({ msg: "Server error generating ML feed" });
  }
});

module.exports = router;

