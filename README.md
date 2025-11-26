# AetherLearn 🎓

**AI-powered 3D Classroom Platform for Offline Education**

An immersive learning platform featuring a 3D virtual classroom with an animated lecturer, designed to work completely offline as a PWA (Progressive Web App).

## 🚀 Features

- **3D Virtual Classroom** - Immersive Three.js environment with animated lecturer
- **AI-Generated Content** - Lectures, quizzes, and tests generated from topics
- **Offline-First PWA** - Works without internet after first load
- **Interactive Learning** - Multiple choice quizzes and written tests
- **Progress Tracking** - Stats saved locally, leaderboard system

## 📁 Project Structure

```
AetherLearn/
├── frontend/              # React + Vite + TypeScript app
│   ├── src/
│   │   ├── components/    # UI components (shadcn/ui)
│   │   ├── pages/         # Route pages
│   │   ├── data/          # JSON data (lectures, quizzes, tests)
│   │   └── ...
│   └── public/
│       └── models/        # 3D GLB models
├── backend/               # (Coming soon) Python FastAPI
└── 3dclassroom/           # Original 3D prototype
```

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Three.js (3D rendering)
- PWA with Service Worker

### Backend (Planned)
- Python FastAPI
- Text-to-Speech generation
- AI content generation

## 🏃 Quick Start

```bash
# Frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero page with features |
| Login | `/login` | User authentication |
| Register | `/register` | New user signup |
| Dashboard | `/dashboard` | Main hub with lectures/tests |
| Lecture | `/lecture/:id` | 3D classroom with audio |
| Quiz | `/quiz/:id` | Multiple choice questions |
| Test | `/test/:id` | Written answers with timer |
| Leaderboard | `/leaderboard` | Rankings |
| Profile | `/profile` | User settings |

## 👥 Team

Built for hackathon - Deadline: Nov 29, 2025 12PM

## 📝 Todo

- [ ] Generate TTS audio files for lectures
- [ ] Backend API for content generation
- [ ] User authentication system
- [ ] Production build + PWA testing
