const Job = require("../models/Job");

exports.createJob = async (req, res) => {
  try {
    const { title, description, skills, budget, location, tags } = req.body;

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim())
      : [];

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim())
      : [];

    const job = new Job({
      title,
      description,
      skills: parsedSkills,
      tags: parsedTags,
      location,
      budget,
      postedBy: req.user,
    });

    await job.save();

    res.status(201).json({ msg: "Job posted", job });
  } catch (err) {
    console.error("Job create error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
