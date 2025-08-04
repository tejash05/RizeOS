import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function JobFeed() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [aiMode, setAiMode] = useState(false);
  const [loadingMap, setLoadingMap] = useState({});
  const [scoreMap, setScoreMap] = useState({});
  const [errorMap, setErrorMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [filterSkill, setFilterSkill] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterTag, setFilterTag] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const storageKey = `appliedJobs_${user?.email}`;

  useEffect(() => {
    fetchJobs();
    const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
    setAppliedJobs(stored);
  }, [aiMode]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const endpoint = aiMode
        ? `https://rizeos-backend-o22d.onrender.com/api/jobs/feed?userEmail=${user.email}`
        : `https://rizeos-backend-o22d.onrender.com/api/jobs`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (aiMode) {
        const aiJobs = data.map((item) => ({
          ...item.job,
          matchScore: item.matchScore,
        }));
        setJobs(aiJobs);
        setFiltered(aiJobs);
      } else {
        const allJobs = data.jobs || [];
        setJobs(allJobs);
        setFiltered(allJobs);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...jobs];
    if (filterSkill) {
      result = result.filter((job) =>
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(filterSkill.toLowerCase())
        )
      );
    }
    if (filterLocation) {
      result = result.filter((job) =>
        job.location?.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }
    if (filterTag) {
      result = result.filter((job) =>
        job.tags?.some((tag) =>
          tag.toLowerCase().includes(filterTag.toLowerCase())
        )
      );
    }
    setFiltered(result);
  };

  const clearFilters = () => {
    setFilterSkill("");
    setFilterLocation("");
    setFilterTag("");
    setFiltered(jobs);
  };

  const checkMatch = async (jobId, description) => {
    if (!user?.bio && !user?.skills) {
      alert("Please complete your bio or skills in profile first.");
      return;
    }

    setLoadingMap((prev) => ({ ...prev, [jobId]: true }));
    setErrorMap((prev) => ({ ...prev, [jobId]: "" }));

    try {
      const res = await fetch("https://rizeos-backend-o22d.onrender.com/api/ai/match-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: description,
          candidateBio: user.bio,
          candidateSkills: user.skills?.join(", "),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed");

      setScoreMap((prev) => ({ ...prev, [jobId]: data.score }));
    } catch (err) {
      setErrorMap((prev) => ({
        ...prev,
        [jobId]: "❌ Could not calculate match score",
      }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleApply = async (jobId, jobTitle) => {
    if (appliedJobs.includes(jobId)) {
      toast.error(`Already applied to "${jobTitle}"`);
      return;
    }

    if (!user?.id) {
      console.error("❌ user.id is missing");
      toast.error("User not logged in properly");
      return;
    }

    try {
      const res = await fetch("https://rizeos-backend-o22d.onrender.com/api/applications/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          jobId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Application failed");

      const updated = [...appliedJobs, jobId];
      setAppliedJobs(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));

      toast.success(`📩 Application submitted for "${jobTitle}"`, {
        duration: 3500,
        position: "top-right",
      });
    } catch (err) {
      console.error("❌ Apply error:", err);
      toast.error("Application failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { marginTop: "4rem" }, // ✅ adds space below navbar
        }}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#1E3A8A]">
          {aiMode ? "🤖 AI-Recommended Jobs" : "🔍 Explore Job Feed"}
        </h2>
        <button
          onClick={() => setAiMode((prev) => !prev)}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded hover:opacity-90 shadow-md"
        >
          {aiMode ? "🔁 Switch to Normal Feed" : "✨ Use AI Suggestions"}
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill
          </label>
          <input
            type="text"
            placeholder="e.g., React"
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g., Delhi"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tag
          </label>
          <input
            type="text"
            placeholder="e.g., Internship"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md"
        >
          🔍 Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
        >
          ❌ Clear
        </button>
      </div>

      {/* Scrollable Job List */}
      <div className="border rounded-lg p-4 shadow-md bg-gray-50 h-[600px] overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center">No jobs match your filters.</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((job, idx) => (
              <div
                key={job._id}
                className="border border-gray-200 rounded p-5 shadow-sm bg-white transition hover:shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-[#1E40AF]">
                    {job.title}
                  </h3>
                  {aiMode && idx === 0 && (
                    <span className="inline-block px-3 py-1 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow">
                      🌟 Top Match
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  📍 Location: {job.location || "N/A"} | 💰 Budget: ₹{job.budget}
                </p>
                <p className="mb-1">
                  <span className="font-medium">🛠️ Skills:</span>{" "}
                  {job.skills?.join(", ") || "None"}
                </p>
                <p className="mb-1">
                  <span className="font-medium">🏷️ Tags:</span>{" "}
                  {job.tags?.join(", ") || "None"}
                </p>
                <p className="text-gray-700">{job.description}</p>

                <div className="mt-4 flex gap-4 flex-wrap">
                  {aiMode ? (
                    <p className="text-sm font-medium text-purple-600">
                      🤝 Match Score:{" "}
                      <span className="text-black">{job.matchScore}</span>
                    </p>
                  ) : (
                    <>
                      <button
                        onClick={() => checkMatch(job._id, job.description)}
                        disabled={loadingMap[job._id]}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 shadow transition"
                      >
                        {loadingMap[job._id] ? "Checking..." : "Check Match Score"}
                      </button>
                      {errorMap[job._id] && (
                        <p className="text-red-600 text-sm mt-2">
                          {errorMap[job._id]}
                        </p>
                      )}
                      {scoreMap[job._id] !== undefined &&
                        !loadingMap[job._id] && (
                          <p className="mt-2 text-sm font-medium text-blue-700">
                            🔥 Match Score:{" "}
                            <span className="text-black">
                              {scoreMap[job._id]}
                            </span>
                          </p>
                        )}
                    </>
                  )}

                  {appliedJobs.includes(job._id) ? (
                    <span className="bg-green-100 text-green-700 font-medium px-4 py-2 rounded shadow-inner">
                      📝 Application Sent
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job._id, job.title)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow-md transition"
                    >
                      ✅ Apply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
