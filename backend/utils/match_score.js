const fetch = require("node-fetch"); // Required for Node.js <18

/**
 * 🔁 Computes AI match score by calling Flask ML API
 * @param {string} jobDesc - Job description
 * @param {string[]} jobSkills - Array of job-related skills
 * @param {string} bio - User's bio
 * @param {string[]} skills - Array of candidate/user skills
 * @returns {Promise<Object>} Match score breakdown
 */
async function compute_match_score_with_breakdown(jobDesc, jobSkills, bio, skills) {
  console.log("📡 Calling Flask ML API with:", {
    jobDesc: jobDesc?.slice(0, 100), // shorten for logs
    jobSkills,
    bio: bio?.slice(0, 100),
    skills,
  });

  const res = await fetch("https://rizeos-ml-production.up.railway.app/match-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobDescription: jobDesc,
      jobSkills,
      candidateBio: bio,
      candidateSkills: skills,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Flask error response:", data);
    throw new Error(data.msg || "Flask match-score failed");
  }

  console.log("✅ Flask responded with:", data);

  return data;
}

module.exports = {
  compute_match_score_with_breakdown,
};
