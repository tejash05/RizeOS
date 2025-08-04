import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      setUser(stored);
      setFormData({
        name: stored.name || "",
        bio: stored.bio || "",
        skills: stored.skills?.join(", ") || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.bio.trim()) {
      toast.error("Name and bio are required");
      return;
    }

    const updatedData = {
      name: formData.name.trim(),
      bio: formData.bio.trim(),
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        `https://rizeos-backend-o22d.onrender.com/api/users/update/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Update failed");

      toast.success("✅ Profile updated");

      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (err) {
      console.error("❌ Error updating profile", err);
      toast.error("Failed to update profile");
    }
  };

  if (!user) return <p className="p-6 text-gray-600">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-blue-700 mb-4">👤 Profile</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email (read-only)
          </label>
          <input
            value={user.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, Python"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          💾 Save Changes
        </button>
      </form>
    </div>
  );
}
