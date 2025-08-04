import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectWallet } from "../utils/wallet";
import { FiMail, FiLock, FiUser, FiLink2, FiFeather } from "react-icons/fi";
import { MdWallet } from "react-icons/md";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    linkedin: "",
    skills: "",
    wallet: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWalletConnect = async () => {
    const result = await connectWallet();
    if (result.success) {
      setForm((prev) => ({ ...prev, wallet: result.address }));
    } else {
      alert(result.error || "Failed to connect wallet.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.wallet) {
      alert("⚠️ Please connect your MetaMask wallet before registering.");
      return;
    }

    try {
      const res = await fetch("https://rizeos-backend-o22d.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f5f7fa] via-[#e4ecf7] to-[#f0f8ff] flex flex-col md:flex-row">
      {/* Branding */}
      <div className="flex items-center justify-center bg-gradient-to-br from-[#fce4ec] via-white to-[#e3f2fd] px-6 py-10 md:py-0 md:w-1/2">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#6a1b9a] drop-shadow mb-3">
            Rize<span className="text-blue-600">OS</span>
          </h1>
          <p className="text-base md:text-lg font-medium text-gray-700 italic mb-3">
            Empowering your hiring, brilliantly.
          </p>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Whether you're seeking the perfect role or the perfect candidate,
            RizeOS gives you the edge. Smart. Fast. Secure.
          </p>
        </div>
      </div>

      {/* Register Form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 py-10 bg-white md:w-1/2">
        <h1 className="text-3xl font-bold text-[#1a237e] mb-1">Create Account</h1>
        <p className="text-sm text-gray-600 mb-6">Join RizeOS to post or apply for jobs</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Name */}
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-2 mb-1">
              <FiUser /> Full Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-2 mb-1">
              <FiMail /> Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-2 mb-1">
              <FiLock /> Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="font-medium text-gray-700 mb-1 block">📝 Bio</label>
            <textarea
              name="bio"
              placeholder="Short bio..."
              value={form.bio}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-2 mb-1">
              <FiLink2 /> LinkedIn
            </label>
            <input
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/..."
              value={form.linkedin}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-2 mb-1">
              <FiFeather /> Skills
            </label>
            <input
              name="skills"
              type="text"
              placeholder="React, Python, Public Speaking..."
              value={form.skills}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>

          {/* Wallet Connect */}
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-2 mb-1">
              <MdWallet /> Wallet Address
            </label>
            <button
              type="button"
              onClick={handleWalletConnect}
              className={`w-full flex justify-center items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition ${
                form.wallet
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {form.wallet
                ? `✅ ${form.wallet.slice(0, 6)}...${form.wallet.slice(-4)}`
                : "Connect MetaMask Wallet"}
            </button>
            {form.wallet && (
              <p className="text-xs text-gray-600 mt-1 truncate">{form.wallet}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>

          {/* Navigate to Login */}
          <p className="text-center text-sm mt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
