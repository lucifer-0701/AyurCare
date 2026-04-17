# 🌿 AyurCare — AI-Powered Ayurvedic Wellness Platform

> Personalized Ayurvedic remedies powered by Groq AI. Enter your symptoms, get a complete herbal treatment plan with ingredient guides, dosage schedules, and PDF exports.

![AyurCare](https://img.shields.io/badge/AyurCare-Ayurvedic%20AI-4A7C59?style=for-the-badge&logo=leaf)
![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-orange?style=for-the-badge)
![Supabase](https://img.shields.io/badge/DB-Supabase-3ECF8E?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge)

---

## ✨ Features

- 🤖 **AI Remedy Generation** — Groq LLaMA-3.3-70B with strict Ayurvedic system prompt
- 🌿 **30+ Conditions** — Arthritis, Diabetes, Anxiety, Insomnia, PCOS, and more
- ⚖️ **Ingredient Scaling** — Auto-scale herb quantities for 1–30 day treatment
- 📄 **PDF Export** — Beautifully formatted downloadable remedy cards
- 📜 **Remedy History** — All sessions saved, bookmarkable, filterable
- 🔐 **Auth** — Supabase email/password with real password reset emails
- 👤 **Personalized AI** — Age, gender, medical history used for better remedies
- 💊 **Safety First** — Doctor consultation flags, severity warnings, disclaimers

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Hosting (Frontend) | **Cloudflare Pages** |
| Backend | Node.js + Express |
| Hosting (Backend) | **Render** |
| Database + Auth | **Supabase** (PostgreSQL + RLS) |
| AI Engine | **Groq** (`llama-3.3-70b-versatile`) |
| PDF Export | jsPDF + autotable |

---

## 📁 Project Structure

```
AyurCare/
├── backend/               # Node.js + Express API
│   ├── server.js
│   ├── src/
│   │   ├── config/       # Supabase admin client
│   │   ├── middleware/   # JWT auth (Supabase verify)
│   │   ├── services/     # Groq AI service
│   │   ├── controllers/  # Remedy controller
│   │   └── routes/       # Express routes
│   └── package.json
├── frontend/              # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/        # Landing, Login, Signup, Dashboard, etc.
│   │   ├── components/   # Navbar, DailyTip, PasswordStrength, etc.
│   │   ├── context/      # AuthContext (Supabase)
│   │   ├── data/         # Diseases, Symptoms, Daily Tips
│   │   ├── services/     # Axios API client
│   │   └── utils/        # PDF export, ingredient scaling
│   └── package.json
├── supabase/
│   └── schema.sql        # Database schema + RLS policies
├── render.yaml           # Render deployment config
└── package.json          # Root (concurrently for local dev)
```

---

## 🚀 Deployment Guide

### 1. Supabase Setup

1. Create a project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** → paste and run `supabase/schema.sql`
3. Go to **Project Settings → API** → copy:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (secret — backend only)
4. Go to **Authentication → URL Configuration**:
   - **Site URL**: `https://your-app.pages.dev`
   - **Redirect URLs**: `https://your-app.pages.dev/reset-password`

---

### 2. Render (Backend Deployment)

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. **Environment Variables** (add these):

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `GROQ_API_KEY` | Your Groq API key (get from console.groq.com) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `FRONTEND_URL` | Your Cloudflare Pages URL (e.g. `https://ayurcare.pages.dev`) |

5. Deploy — note your Render URL (e.g. `https://ayurcare-backend.onrender.com`)

---

### 3. Cloudflare Pages (Frontend Deployment)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → **Create a project**
2. Connect your GitHub repo
3. **Build Settings**:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. **Environment Variables** (add these):

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_API_URL` | Your Render backend URL (e.g. `https://ayurcare-backend.onrender.com`) |

5. Deploy! 🚀

---

## 💻 Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/AyurCare.git
cd AyurCare

# Install all dependencies
npm run install:all

# Set up environment files
cp .env.example .env
# Fill in backend/.env and frontend/.env with your Supabase keys

# Run both servers with one command
npm start
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health check**: http://localhost:5000/api/health

---

## 🔐 Environment Variables

### `backend/.env`
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
GROQ_API_KEY=your_groq_key
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
```

### `frontend/.env`
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
VITE_API_URL=http://localhost:5000
```

---

## ⚠️ Disclaimer

AyurCare provides traditional Ayurvedic information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified practitioner.

---

## 📜 License

MIT License — Made with 🌿 for natural wellness
