# 🚀 RizeOS – AI + Web3 Job Platform

**RizeOS** is an intelligent, decentralized job and talent discovery platform powered by AI & Web3. It features semantic job matching, MetaMask wallet integration, and end-to-end recruitment tools – all in a clean developer-friendly stack.

---

## ⚙️ Tech Stack Overview

### 🖥️ Frontend
| Tech | Description |
|------|-------------|
| ![React](https://img.shields.io/badge/React-18-blue?logo=react) | Component-based UI |
| ![Vite](https://img.shields.io/badge/Vite-fast%20dev-yellow?logo=vite) | Fast bundler |
| ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwind-css) | Utility-first CSS |
| ![Router](https://img.shields.io/badge/React--Router-DOM-blueviolet?logo=react-router) | SPA Routing |
| ![Toast](https://img.shields.io/badge/Hot--Toast-UX-green?logo=react) | Feedback system |
| ![Icons](https://img.shields.io/badge/Lucide%20Icons-UI-orange?logo=react) | Icon packs |

### 🌐 Backend
| Tech | Description |
|------|-------------|
| ![Node](https://img.shields.io/badge/Node.js-JS-green?logo=node.js) | Backend runtime |
| ![Express](https://img.shields.io/badge/Express.js-REST-black?logo=express) | API framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-brightgreen?logo=mongodb) | Database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-ODM-red?logo=mongodb) | Mongo wrapper |
| ![JWT](https://img.shields.io/badge/JWT-Auth-blue?logo=json-web-tokens) | Secure tokens |
| ![Render](https://img.shields.io/badge/Render-Deployment-purple?logo=render) | Hosted backend |

### 🤖 AI + ML Microservice
| Tech | Description |
|------|-------------|
| ![Python](https://img.shields.io/badge/Python-ML-yellow?logo=python) | Flask service |
| ![NLP](https://img.shields.io/badge/Sentence--Transformers-gte--large-blue?logo=pytorch) | Semantic embeddings |
| ![Fuzzy](https://img.shields.io/badge/rapidfuzz-matching-orange?logo=python) | Fuzzy string logic |
| ![Cosine](https://img.shields.io/badge/Cosine--Sim-Similarity-red?logo=python) | Vector comparison |
| ![Railway](https://img.shields.io/badge/Railway-Deployment-blueviolet?logo=railway) | AI service hosting |

### 🧾 Web3 + Payments
| Tech | Description |
|------|-------------|
| ![MetaMask](https://img.shields.io/badge/MetaMask-Wallet-orange?logo=metamask) | Wallet login |
| ![Ethers](https://img.shields.io/badge/Ethers.js-Web3-green?logo=ethereum) | ETH transactions |
| ![OnChain](https://img.shields.io/badge/On--Chain-Payments-blue?logo=ethereum) | Smart payments |
| ![Logger](https://img.shields.io/badge/Tx--Logger-Hash--Recorder-lightgrey?logo=logstash) | Payment logs |

---

## 🧠 Core Features

### 🔐 Authentication & Profile
- JWT-based email login
- MetaMask address stored securely
- Profile includes bio, skills, LinkedIn, resume upload
- Role-agnostic (can post & apply both)

### 🏠 Homepage
- Clean gradient hero section
- Animated icons / SVGs
- 24/7 support highlight + ownership intent

### 📝 Job Posting
- Post with title, description, budget, skills, tags
- ETH payment (0.001) required to post job
- Payment logged on-chain

### 🧠 AI-Powered Job Feed
- Match Score based on:
  - Semantic bio ↔ job description
  - Skill vector overlap
  - Fuzzy & token matching
- Dynamic color badges for match strength

### 📄 Applications
- Apply to jobs via "Apply" button
- Auto-shows "Applied" if already applied
- `/applications` page shows user submissions

### 💳 Payments
- ETH sent to admin wallet on posting
- Payment logged (job, txn hash, etherscan link)
- `/payments` shows all transaction history

---

## 📸 Screenshots

| Login | Register | Home |
|-------|----------|------|
| ![](assets/login.png) | ![](assets/register.png) | ![](assets/homepage.png) |

| Feed (AI + Normal) | Job Post | Edit Profile |
|--------------------|----------|---------------|
| ![](assets/feed.png) | ![](assets/jobPost.png) | ![](assets/editprofile.png) |

| Applications | Payment History | Admin Wallet |
|--------------|------------------|---------------|
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
│   ├── middlewares/         # authMiddleware.js
│   └── server.js
├── ml/                      # match_score.py, ml_api.py
│   └── Dockerfile
├── .env
└── README.md
```
🧪 Match Score Logic (AI Breakdown)
Component	Method
🔬 Bio ↔ Description	Semantic similarity
🧠 Skills ↔ Job Skills	Cosine + Fuzzy + Token scoring
⚖️ Weightage	

    20% bio-desc semantic similarity

    20% skill embedding similarity

    40% fuzzy skill score

    10% token score

🟢 Outputs:

    Match Score (0-100)

    Label: 🔥 Strong, ⚠️ Moderate, ❌ Weak

🧑‍💻 Author

    Name: Tejash Tarun

    Role: Full Stack Developer | AI + Web3 Engineer | UI/UX Lead

    GitHub: @tejash05

🌐 Deployment Info
| Service       | Link                                                                 |
|---------------|----------------------------------------------------------------------|
| 🖥️ Frontend   | [https://rizeos-3dca.onrender.com](https://rizeos-3dca.onrender.com) |


# 1. Clone repo
```
git clone https://github.com/tejash05/RizeOS.git
cd RizeOS
```

# 2. Start backend
```
cd backend
npm install
npm run dev
```

# 3. Start frontend
```
cd ../frontend
npm install
npm run dev
```

# 4. Start ML API
```
cd ../ml
pip install -r requirements.txt
python ml_api.py
```

🧪 Ensure .env is configured for backend (Mongo URI, JWT secret, etc.)

    Star ⭐ the repo if this helped you! Contributions & forks welcome 🧑‍💻
