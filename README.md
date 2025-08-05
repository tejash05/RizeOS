 🚀 RizeOS – AI + Web3 Job Platform

**RizeOS** is an intelligent, decentralized job and talent discovery platform built using modern full-stack technologies. It leverages **AI for job-candidate matching**, **Web3 wallet authentication**, and a **clean developer-friendly architecture**.

---

## ⚙️ Tech Stack Overview

### 🖥️ Frontend
- ⚛️ React 18 + Vite
- 🎨 Tailwind CSS
- 🔀 React Router DOM
- 🔔 React Hot Toast
- 📦 Zustand (for optional global state)
- 💡 Lucide + React Icons

### 🌐 Backend
- 🔧 Node.js + Express.js
- 🗃️ MongoDB + Mongoose
- 🔐 JWT-based Auth with Middleware
- ☁️ Render Deployment + RESTful APIs

### 🤖 AI + ML Microservice
- 🧠 Python (Flask API)
- 📚 Sentence Transformers (`gte-large`)
- 🧪 Fuzzy Logic with `rapidfuzz`
- 📊 Cosine Similarity, Token Matching, and Clean NLP Pipeline
- 🚀 Deployed on Railway / Google Cloud Run

### 🧾 Web3 + Payments
- 🔗 MetaMask Wallet Connect
- 💸 On-chain ETH payment via Ethers.js
- 🧾 Payment logging with Transaction Hash
- 📈 Admin ETH Wallet integrated (showcase)

---

## 🧠 Core Features

### 🔐 Authentication & Profile
- Email-password-based login & JWT auth
- MetaMask wallet address saved securely
- User profile includes bio, skills, LinkedIn, and resume upload
- Role-agnostic: Users can post and apply both

### 🏠 Homepage
- Clean responsive design
- Hero CTA section with animated SVGs or icons
- 24/7 support + ownership features

### 📝 Job Posting
- Post job with title, description, budget, skills, tags
- Platform fee (in ETH) required to publish job
- On successful post, job is stored + payment is logged

### 🧠 AI-Powered Job Feed
- AI Match Score calculated using:
  - Semantic similarity (bio ↔ description)
  - Skill vector similarity (job ↔ user)
  - Fuzzy matching + token scoring
- Displayed with colored badge and dynamic score

### 📄 Applications
- Apply to jobs directly from feed
- UI shows “Applied” if user already applied
- Applications are persistent across sessions
- `/applications` route shows user’s applied jobs

### 💳 Payments
- Platform fee (0.001 ETH) goes to admin wallet
- Transaction recorded on-chain via MetaMask
- `/payments` route displays all successful transactions with:
  - Job title
  - Amount paid
  - Timestamp
  - Etherscan explorer link

---

## 📸 Screenshots

> Add the following images under `/public/screenshots/` or `readme-assets/`.

| Login | Register | Home |
|-------|----------|------|
| ![](assets/login.png) | ![](assets/register.png) | ![](assets/homepage.png) |

| Feed (AI + Normal) | Job Post | Edit Profile |
|--------------------|----------|---------------|
| ![](readme/feed.png) | ![](assets/jobPost.png) | ![](assets/editprofile.png) |

| Applications | Payment History | Admin Wallet |
|-----------------|------------------|---------------|
| ![](assets/Applications.png) | ![](assets/payment-history.png) | ![](assets/adminWallet.png) |

---

## 🧩 Folder Structure

```bash
RizeOS/
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Register, JobFeed, JobPost, EditProfile etc.
│   │   ├── components/      # Navbar, Modals, ScoreBadge etc.
│   │   ├── utils/           # payPlatformFee.js, wallet.js, PrivateRoute.jsx
│   │   ├── App.jsx
│   │   └── index.css
├── backend/
│   ├── models/              # User, Job, Application, Payment
│   ├── controllers/         # authController.js, jobController.js
│   ├── routes/              # /auth, /jobs, /ai, /payments, /applications
│   ├── middlewares/        # authMiddleware.js
│   └── server.js
├── ml/                      # match_score.py, ml_api.py
│   └── Dockerfile
├── .env
└── README.md
```
🧪 Match Score Logic (Python AI Service)

The match score is calculated via a multi-step process:

    Bio ↔ Job Description: Cosine similarity (semantic)

    Skills ↔ Job Skills: Semantic + Fuzzy + Token score

    Weightage:

        20% bio-desc similarity

        20% embedding similarity

        40% fuzzy skill score

        10% semantic pairwise token score

    Final output is a numeric score and label (🔥 Strong Match / ⚠️ Moderate / ❌ Weak)

💡 Unique Highlights
Feature	Status
AI Match Score (via Flask)	✅
Web3 MetaMask Integration	✅
Resume Skill Extraction	✅
JWT Auth + Private Routes	✅
Payment Logging + Explorer	✅
Role-based Feed & Filtering	✅
Persistent Applications	✅
Mobile Responsive UI	✅
🧑‍💻 Author

Name: Tejash Tarun
Role: Full Stack Developer | AI + Web3 Engineer | UI/UX Lead
GitHub: @tejash05
🌐 Deployment Info

    🔗 Frontend: https://rizeos-frontend.onrender.com

    🔗 Backend: https://rizeos-backend.onrender.com

    🔗 ML API (Flask): https://rizeos-ml-api.up.railway.app

