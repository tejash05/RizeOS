import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { connectWallet } from "../utils/wallet";
import toast, { Toaster } from "react-hot-toast";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    linkedin: "",
    skills: "",
    wallet: "",
    email: "",
    resume: "",
  });

  const [resume, setResume] = useState(null);
  const [showWallet, setShowWallet] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          const walletFromStorage = localStorage.getItem("wallet");

          setForm({
            name: data.name || "",
            bio: data.bio || "",
            linkedin: data.linkedin || "",
            skills: data.skills || "",
            wallet: walletFromStorage || data.wallet || "",
            email: data.email || "",
            resume: data.resume || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        toast.error("❌ Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) setResume(file);
  };

  const handleWalletConnect = async () => {
    const result = await connectWallet();
    if (result?.success) {
      const updatedForm = { ...form, wallet: result.address };
      setForm(updatedForm);
      localStorage.setItem("wallet", result.address);
      toast.success("Wallet connected");
    } else {
      toast.error(result?.error || "Failed to connect wallet");
    }
  };

  const handleSkillExtract = async () => {
    let activeResume = resume;

    if (!activeResume && form.resume) {
      try {
        const resFile = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/uploads/${form.resume}`
        );
        const blob = await resFile.blob();
        activeResume = new File([blob], form.resume, { type: blob.type });
        setResume(activeResume);
      } catch (err) {
        toast.error("Failed to load uploaded resume Please re-upload");
        return;
      }
    }

    if (!activeResume) {
      toast.error("Please upload or select a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", activeResume);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/extract-skills`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Skill extraction failed");
        return;
      }

      setForm((prev) => ({ ...prev, skills: data.skills }));
      toast.success("Skills extracted successfully");
    } catch (err) {
      console.error("Skill extraction error", err);
      toast.error("Something went wrong during skill extraction");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key]) formData.append(key, form[key]);
      }
      if (resume) formData.append("resume", resume);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully");

      // save updated user to localStorage for JobFeed etc
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("wallet", data.wallet || "");

      setForm((prev) => ({ ...prev, resume: data.resume }));
      setResume(null);
    } catch (err) {
      console.error("Update error", err);
      toast.error("Something went wrong while updating profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 py-10">
      <Toaster position="top-right" toastOptions={{ style: { marginTop: "4rem" } }} />
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-2xl border border-gray-200 rounded-2xl p-8 sm:p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">LinkedIn URL</label>
            <input
              name="linkedin"
              type="url"
              value={form.linkedin}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Skills (comma separated)
            </label>
            <input
              name="skills"
              type="text"
              value={form.skills}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Wallet Address</label>
            {form.wallet ? (
              <div className="relative">
                <input
                  name="wallet"
                  type={showWallet ? "text" : "password"}
                  value={form.wallet}
                  readOnly
                  className="w-full border p-3 rounded-lg bg-gray-100 text-gray-600 pr-10 cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowWallet(!showWallet)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                >
                  {showWallet ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleWalletConnect}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium shadow-md transition-all"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Resume (PDF or DOCX)
            </label>
            {form.resume ? (
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href={`${import.meta.env.VITE_BACKEND_URL}/uploads/${form.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Uploaded Resume
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, resume: "" }));
                    setResume(null);
                  }}
                  className="text-red-600 underline text-xs"
                >
                  Remove Resume
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="block w-full text-sm text-gray-700 border p-2 rounded"
              />
            )}
            <button
              type="button"
              onClick={handleSkillExtract}
              disabled={!resume && !form.resume}
              className={`mt-3 w-full py-2 px-4 rounded-lg text-white text-sm font-semibold shadow transition-all ${
                resume || form.resume
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Extract Skills from Resume
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
