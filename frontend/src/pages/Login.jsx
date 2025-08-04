import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://rizeos-backend-o22d.onrender.com/api/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Login failed", {
          style: {
            borderRadius: "8px",
            background: "#fff1f2",
            color: "#b91c1c",
          },
        });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("🎉 Login successful!", {
        duration: 2000,
        style: {
          borderRadius: "8px",
          background: "#ecfdf5",
          color: "#065f46",
        },
      });

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", {
        style: {
          borderRadius: "8px",
          background: "#fff7ed",
          color: "#b45309",
        },
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-r from-[#f5f7fa] via-[#e4ecf7] to-[#f0f8ff]">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left - Branding */}
      <div className="flex items-center justify-center bg-gradient-to-br from-[#fce4ec] via-white to-[#e3f2fd] px-6 py-10 md:py-0">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#6a1b9a] drop-shadow mb-2 md:mb-4">
            Rize<span className="text-blue-600">OS</span>
          </h1>
          <p className="text-base md:text-lg font-medium text-gray-700 italic">
            Empowering your hiring, brilliantly.
          </p>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-3 leading-relaxed">
            Welcome back! Access the latest jobs, connect your wallet, and get
            started with your career journey at RizeOS.
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12 bg-white">
        <h1 className="text-3xl font-bold text-[#1a237e] mb-1">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-6">Please enter your details</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Email */}
          <div>
            <label className="font-medium text-gray-700 flex items-center gap-2 mb-1">
              <FiMail /> Email address
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

          {/* Remember me only */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox rounded" />
              Remember for 30 days
            </label>
          </div>

          {/* Sign In */}
          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded-md font-semibold hover:bg-purple-800 transition"
          >
            Sign in
          </button>

          {/* Register Link */}
          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-purple-700 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
