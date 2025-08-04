import React, { useEffect, useState } from "react";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (!localUser) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(localUser);
      setUser(parsedUser);
    } catch {
      setError("Failed to parse user.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !user.id) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://rizeos-backend-o22d.onrender.com/api/applications/${user.id}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.msg || "Failed to fetch applications");
        } else {
          console.log("🟢 Applications received from backend:", data);
          setApplications(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-indigo-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          📝 My Applications
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven’t applied for any jobs yet.
          </p>
        ) : (
          <ul className="space-y-5">
            {applications.map((job) => (
              <li
                key={job._id}
                className="p-5 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                <h2 className="font-semibold text-lg text-blue-800">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-700">{job.company}</p>
                {job.location && (
                  <p className="text-xs text-gray-500">{job.location}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
