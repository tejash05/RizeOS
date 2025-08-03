const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [String],
    budget: { type: Number, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: { type: String },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
