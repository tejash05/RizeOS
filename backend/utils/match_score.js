const axios = require("axios"); // ✅ Use axios for reliable requests

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

  try {
    const response = await axios.post("https://rizeos-ml-production.up.railway.app/match-score", {
      jobDescription: jobDesc,
      jobSkills,
      candidateBio: bio,
      candidateSkills: skills,
    });

    console.log("✅ Flask responded with:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Error calling Flask API:", err.response?.data || err.message);
    throw new Error("Flask match-score failed");
  }
}

module.exports = {
  compute_match_score_with_breakdown,
};
