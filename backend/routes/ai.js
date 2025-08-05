const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const OpenAI = require("openai");
const fs = require("fs");
const axios = require("axios"); 

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * 📄 Resume Skill Extraction
 */
router.post("/extract-skills", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ msg: "No file uploaded" });

    let resumeText = "";

    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(fs.readFileSync(file.path));
      resumeText = data.text;
    } else if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const data = await mammoth.extractRawText({ path: file.path });
      resumeText = data.value;
    } else {
      return res.status(400).json({ msg: "Unsupported file format" });
    }

    const prompt = `Extract a clean, comma-separated list of professional and technical skills from this resume:

${resumeText}

Just return the skills, nothing else.`;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const skills = gptResponse.choices[0].message.content.trim();
    res.json({ skills });
  } catch (err) {
    console.error("❌ AI skill extraction error:", err);
    res.status(500).json({ msg: "Server error while extracting skills" });
  } finally {
    if (req.file) fs.unlinkSync(req.file.path);
  }
});

/**
 * 🤖 Match Score via Python Flask API
 */
router.post("/match-score", async (req, res) => {
  const { jobDescription, jobSkills, candidateBio, candidateSkills } = req.body;

  if (!jobDescription || (!candidateBio && !candidateSkills)) {
    return res.status(400).json({ msg: "Missing input" });
  }

  try {
    const flaskRes = await axios.post("https://rizeos-ml-production.up.railway.app/match-score", {
      jobDescription,
      jobSkills,
      candidateBio,
      candidateSkills,
    });

    res.json(flaskRes.data); // full breakdown returned
  } catch (err) {
    console.error("❌ Flask API error:", err.message);
    res.status(500).json({ msg: "Failed to get match score from ML service" });
  }
});

module.exports = router;
