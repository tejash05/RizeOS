import React, { useEffect, useState } from "react";

export default function MatchScore({ jobDescription }) {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScore = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.bio && !user?.skills) return;

      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${import.meta.env.VITE_ML_API_URL}/match-score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobDescription,
            candidateBio: user.bio,
            candidateSkills: user.skills,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to fetch match score");
        setScore(data.score);
      } catch (err) {
        console.error("Match score error:", err);
        setError("❌ Could not calculate match score");
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [jobDescription]);

  const badgeColor =
    score >= 0.8
      ? "bg-green-500"
      : score >= 0.5
      ? "bg-yellow-400"
      : "bg-red-400";

  const badgeLabel =
    score >= 0.8
      ? "🔥 Strong Match"
      : score >= 0.5
      ? "⚠️ Moderate Match"
      : "❌ Weak Match";

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 text-center">
      {loading && <p>🔄 Calculating match score...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {score !== null && !loading && (
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-1">AI Match Score</p>
          <span className={`text-white px-3 py-1 text-sm rounded-full ${badgeColor}`}>
            {badgeLabel} ({score})
          </span>
        </div>
      )}
    </div>
  );
}
