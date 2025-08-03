const mongoose = require("mongoose");
require("dotenv").config();
const Job = require("../models/Job");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    const mockJobs = [
      {
        title: "Frontend Developer",
        description: "We need a skilled React developer to join our product team.",
        skills: ["React", "JavaScript", "CSS"],
        location: "Bangalore",
        tags: ["Frontend", "Remote"],
        budget: 60000,
        postedBy: "64e404c95ea123456789abcd", // Replace with a real user _id
      },
      {
        title: "Backend Engineer",
        description: "Node.js and MongoDB backend developer for scalable systems.",
        skills: ["Node.js", "MongoDB", "Express"],
        location: "Hyderabad",
        tags: ["Backend", "API"],
        budget: 75000,
        postedBy: "64e404c95ea123456789abcd",
      },
      {
        title: "Full Stack Developer",
        description: "We’re building a startup MVP using MERN stack.",
        skills: ["MongoDB", "Express", "React", "Node.js"],
        location: "Remote",
        tags: ["MERN", "Startup"],
        budget: 85000,
        postedBy: "64e404c95ea123456789abcd",
      },
      {
        title: "AI/ML Engineer",
        description: "Looking for an ML engineer familiar with OpenAI APIs and model deployment.",
        skills: ["Python", "OpenAI", "ML"],
        location: "Delhi",
        tags: ["AI", "Machine Learning"],
        budget: 100000,
        postedBy: "64e404c95ea123456789abcd",
      },
    ];

    for (const job of mockJobs) {
      const exists = await Job.findOne({ title: job.title, budget: job.budget });
      if (!exists) {
        await Job.create(job);
        console.log(`✅ Inserted: ${job.title}`);
      } else {
        console.log(`⚠️ Skipped (already exists): ${job.title}`);
      }
    }

    console.log("🎉 Mock job seeding complete.");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
