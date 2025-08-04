import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { payPlatformFee } from "../utils/payPlatformFee";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiTag,
  FiList,
  FiFileText,
} from "react-icons/fi";

export default function JobPostForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    location: "",
    tags: "",
  });

  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true); // start progress bar

    try {
      const result = await payPlatformFee();
      if (!result?.success) {
        alert("Payment failed.");
        setPosting(false);
        return;
      }

      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const res = await fetch("https://rizeos-backend-o22d.onrender.com/api/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.msg || "❌ Job posting failed");
        setPosting(false);
        return;
      }

      const jobId = data.job._id;
      const jobTitle = data.job.title;

      console.log("📤 Logging payment...", {
        jobId,
        jobTitle,
        txHash: result.txHash,
        wallet: result.wallet,
        amount: result.amount,
      });

      const logRes = await fetch("https://rizeos-backend-o22d.onrender.com/api/payments/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          jobId,
          txHash: result.txHash,
          wallet: result.wallet,
          amount: result.amount,
          status: "success",
        }),
      });

      const logData = await logRes.json();
      console.log("✅ Log response:", logData);

      alert("✅ Job posted & payment logged successfully!");
      navigate("/jobs");
    } catch (err) {
      console.error("❌ Job post error:", err);
      alert("Something went wrong while posting the job!");
    } finally {
      setPosting(false); // end progress bar
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[#e0f7fa] via-white to-[#f3e5f5] animate-gradient-slow">
      {/* Progress bar */}
      {posting && (
        <div className="fixed top-0 left-0 w-full h-1 z-50">
          <div className="h-full bg-green-500 animate-pulse animate-[pulse_1.2s_linear_infinite]" />
        </div>
      )}

      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-300 rounded-full opacity-20 blur-3xl z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-300 rounded-full opacity-20 blur-3xl z-0" />
      <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200 rounded-2xl p-8 sm:p-10 z-10">
        <h2 className="text-3xl font-extrabold text-center text-[#1a237e] mb-8 tracking-tight">
          🚀 Post a Job
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-1">
              <FiBriefcase /> Job Title
            </label>
            <input
              name="title"
              type="text"
              placeholder="e.g., Frontend Developer"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-1">
              <FiFileText /> Job Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe the responsibilities, requirements..."
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-1">
              <FiList /> Skills (comma separated)
            </label>
            <input
              name="skills"
              type="text"
              placeholder="e.g., React, Tailwind, Node.js"
              value={form.skills}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-1">
              <FiMapPin /> Location
            </label>
            <input
              name="location"
              type="text"
              placeholder="e.g., Remote / Delhi"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-1">
              <FiTag /> Tags (comma separated)
            </label>
            <input
              name="tags"
              type="text"
              placeholder="e.g., Internship, Urgent"
              value={form.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-1">
              <FiDollarSign /> Budget (INR or USD)
            </label>
            <input
              name="budget"
              type="number"
              placeholder="e.g., 20000"
              value={form.budget}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={posting}
            className={`w-full ${
              posting ? "opacity-70 cursor-wait" : ""
            } bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.01] hover:shadow-lg transition-all`}
          >
            {posting ? "⏳ Posting..." : "📤 Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
