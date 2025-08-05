// backend/utils/match_score.js
const fetch = require("node-fetch"); // ✅ Required in Node.js

async function compute_match_score_with_breakdown(jobDesc, jobSkills, bio, skills) {
  const res = await fetch("https://rizeos-ml-production.up.railway.app/match-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobDescription: jobDesc,
      jobSkills: jobSkills,
      candidateBio: bio,
      candidateSkills: skills,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Failed to compute match");

  return data;
}

module.exports = {
  compute_match_score_with_breakdown,
};
