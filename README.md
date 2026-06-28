# 🎓 Smart Campus Utility App

> Organize. Manage. Simplify Campus Life.

A full-stack Next.js 14 web application for managing daily college activities — built with TypeScript, Tailwind CSS, and localStorage for persistent data.

---

## ✨ Features

- **Dashboard** — Overview of tasks, attendance, schedule & notices
- **Timetable** — Add/view/delete class schedule by day
- **Task Tracker** — Manage assignments with priorities & due dates
- **Attendance** — Mark and visualize attendance per subject with charts
- **Notice Board** — Post and view academic/event/general notices
- **Notes** — Create, pin, edit and organize personal notes
- **Profile** — Manage student profile details
- **Dark / Light Mode** — Toggle with one click
- **Responsive** — Works on mobile & desktop

---

## 🚀 Running Locally (Windows)

### Prerequisites
- **Node.js** v18+ — Download from https://nodejs.org

### Steps

```bash
# 1. Extract the zip, open Command Prompt in the folder
cd smart-campus

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## ☁️ Deploying to Vercel

### Option A — Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# In the project folder
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: smart-campus
# - Directory: ./
# - Override settings? No
```

Your app will be live at `https://smart-campus-xxx.vercel.app`

### Option B — GitHub + Vercel Dashboard

1. Push this folder to a GitHub repository
2. Go to https://vercel.com → New Project
3. Import your GitHub repo
4. Click **Deploy** — no extra config needed!

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Storage | localStorage (client-side) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
smart-campus/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Dashboard
│   │   ├── timetable/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── attendance/page.tsx
│   │   ├── notices/page.tsx
│   │   ├── notes/page.tsx
│   │   └── profile/page.tsx
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       └── TopBar.tsx
│   ├── lib/
│   │   └── store.tsx          # Global state (React Context + localStorage)
│   └── styles/
│       └── globals.css
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 📝 Notes

- All data is stored in your browser's **localStorage** — no backend or database needed
- Data persists between page refreshes but is browser/device-specific
- The app works completely offline after the first load
