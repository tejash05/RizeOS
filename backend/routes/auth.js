const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const { registerUser, loginUser } = require("../controllers/authController");

// ✅ Multer setup to store uploaded resumes in "uploads/" folder
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ JWT middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch {
    return res.status(403).json({ msg: "Invalid token" });
  }
};

// ✅ @route   POST /api/auth/register
router.post("/register", registerUser);

// ✅ @route   POST /api/auth/login
router.post("/", loginUser);

// ✅ @route   GET /api/auth/profile (fetch user profile)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ @route   PUT /api/auth/profile (update profile + resume)
router.put("/profile", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.resume = req.file.filename; // store file name only..
    }

    const updated = await User.findByIdAndUpdate(req.user, updates, { new: true }).select("-password");
    res.json(updated);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
