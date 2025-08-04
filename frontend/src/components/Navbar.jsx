import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import {
  FileText,
  Megaphone,
  LogOut,
  UserCircle,
  User,
  Bell,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hiddenIds, setHiddenIds] = useState(
    () => JSON.parse(localStorage.getItem("hiddenNotifs")) || []
  );

  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("user");
      if (token && userInfo) {
        try {
          setUser(JSON.parse(userInfo));
        } catch {
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkAuth();
    const interval = setInterval(checkAuth, 500);
    return () => clearInterval(interval);
  }, []);

  // Global notifications
  useEffect(() => {
    if (!user) return;
    fetch("https://rizeos-backend-o22d.onrender.com/api/notifications/global")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.notifications.filter(
          (n) => !hiddenIds.includes(n._id)
        );
        setNotifications(filtered);
      })
      .catch((err) =>
        console.error("🔔 Notification fetch error:", err.message)
      );
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const dismissNotif = (id) => {
    const updated = [...hiddenIds, id];
    localStorage.setItem("hiddenNotifs", JSON.stringify(updated));
    setHiddenIds(updated);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-[#f5f7fa] via-[#e4ecf7] to-[#f0f8ff] text-[#1a237e] px-6 py-4 shadow-md flex justify-between items-center">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-8">
        <Link
          to="/home"
          className="text-2xl md:text-3xl font-extrabold tracking-wide text-[#6a1b9a] hover:text-blue-600 transition"
        >
          Rize<span className="text-blue-600">OS</span>
        </Link>

        {user && (
          <>
            <Link
              to="/jobs"
              className="flex items-center gap-1 font-medium hover:text-blue-600 transition"
            >
              <FileText className="w-4 h-4" />
              Feed
            </Link>
            <Link
              to="/post-job"
              className="flex items-center gap-1 font-medium hover:text-blue-600 transition"
            >
              <Megaphone className="w-4 h-4" />
              Post Job
            </Link>
          </>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center space-x-4">
        {user && (
          <div
            className="relative"
            ref={notifDropdownRef}
            onMouseEnter={() => setNotifOpen(true)}
            onMouseLeave={() => setNotifOpen(false)}
          >
            <button className="relative p-2 rounded-full hover:bg-white/20 transition">
              <Bell className="w-6 h-6 text-[#1a237e]" />
              {notifications.length > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="absolute -top-1 -right-1 text-[10px] text-white bg-red-600 px-1.5 py-0.5 rounded-full font-bold">
                    {notifications.length}
                  </span>
                </>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 max-w-sm bg-white text-black border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-3 font-bold text-sm border-b bg-gray-50">
                    🔔 Latest Job Posts
                  </div>

                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((n) => (
                        <div
                          key={n._id}
                          className="relative px-4 py-3 pr-10 hover:bg-gray-50 transition border-b last:border-none"
                        >
                          <div className="text-sm font-medium truncate pr-2">
                            {n.title}
                          </div>
                          {n.location && (
                            <div className="text-xs text-gray-600">
                              {n.location}
                            </div>
                          )}
                          <div className="text-[11px] text-gray-400 mt-1">
                            {format(n.createdAt)}
                          </div>
                          <button
                            onClick={() => dismissNotif(n._id)}
                            className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-sm"
                            title="Dismiss"
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                      <div className="px-4 py-2 border-t bg-gray-50 text-center">
                        <Link
                          to="/jobs"
                          className="inline-block px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-md shadow-md transition"
                        >
                          View All Jobs
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-600 p-4 text-center">
                      🎉 No new notifications
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {user ? (
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="bg-[#2563EB] px-5 py-2 rounded-md text-white text-base font-medium hover:bg-[#1D4ED8] transition flex items-center gap-2">
              <UserCircle className="w-5 h-5" />
              {user.name}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-xl rounded-md border z-50">
                <Link
                  to="/edit-profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#E0F2FE] transition"
                >
                  <User className="w-4 h-4" />
                  Edit Profile
                </Link>

                <Link
                  to="/payments"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#E0F2FE] transition"
                >
                  💳 Payments
                </Link>

                <Link
                  to="/applications"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#E0F2FE] transition"
                >
                  📄 My Applications
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-[#E0F2FE] transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/"
              className="text-sm font-medium text-[#1a237e] hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-[#1a237e] hover:text-blue-600 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
