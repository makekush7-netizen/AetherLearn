# AetherLearn - MVP Project Specification

**Project Goal:** AI-powered 3D classroom platform for offline education delivery in rural areas

**Timeline:** Nov 26 4PM - Nov 29 12PM (56 hours total)
**Hackathon Submit:** Nov 29 12PM

---

## 🎯 Core Vision

A mobile-friendly learning platform featuring an **AI 3D Lecturer** that teaches students topic-wise lessons with automatic speech synthesis, quizzes, tests, and a leaderboard system. Designed for **100% offline operation** after initial download.

---

## 🏗️ Project Architecture

```
AetherLearn/
├── frontend/                 (React + Vite - Desktop/Mobile)
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3D/
│   │   │   │   ├── Classroom.jsx         (Three.js 3D scene)
│   │   │   │   └── LecturerAvatar.jsx    (Model + animations)
│   │   │   ├── Lecture/
│   │   │   │   ├── LecturePlayer.jsx     (Video+Audio+Caption player)
│   │   │   │   └── NotesPanel.jsx        (Shows notes/whiteboard)
│   │   │   ├── Quiz/
│   │   │   │   ├── QuizPlayer.jsx        (Multiple choice questions)
│   │   │   │   └── QuizResult.jsx        (Shows score)
│   │   │   ├── Test/
│   │   │   │   ├── TestPlayer.jsx        (Written answer questions)
│   │   │   │   └── TestSubmit.jsx        (Submit answers)
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx             (Class ID login)
│   │   │   │   └── StudentRegister.jsx   (Join class)
│   │   │   ├── Leaderboard/
│   │   │   │   └── Leaderboard.jsx       (Class scores)
│   │   │   ├── DoubtsChat/
│   │   │   │   └── DoubtsBot.jsx         (Chatbot interface)
│   │   │   └── TeacherDash/
│   │   │       ├── TeacherLogin.jsx      (Admin login)
│   │   │       └── StudentAnalytics.jsx  (View student progress)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx             (Main hub)
│   │   │   ├── LecturePage.jsx           (Lecture container)
│   │   │   ├── QuizPage.jsx              (Quiz container)
│   │   │   ├── TestPage.jsx              (Test container)
│   │   │   └── AdminPage.jsx             (Teacher/Admin panel)
│   │   ├── utils/
│   │   │   ├── offlineStorage.js         (IndexedDB wrapper)
│   │   │   ├── syncManager.js            (Online/offline sync)
│   │   │   ├── apiClient.js              (Backend API calls)
│   │   │   └── authHelper.js             (Auth logic)
│   │   ├── data/
│   │   │   ├── lectures.json             (Sample lecture data)
│   │   │   ├── quizzes.json              (Sample quiz data)
│   │   │   └── tests.json                (Sample test data)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   ├── models/
│   │   │   ├── basic_classroom.glb       (Existing)
│   │   │   └── lecturer.glb              (Existing)
│   │   └── audios/
│   │       └── [lecture audio files].mp3
│   ├── vite.config.js
│   └── package.json
│
├── backend/                  (Flask + MySQL)
│   ├── app.py               (Flask app initialization)
│   ├── routes/
│   │   ├── auth.py          (Login/register endpoints)
│   │   ├── lectures.py      (Lecture CRUD)
│   │   ├── quizzes.py       (Quiz endpoints)
│   │   ├── tests.py         (Test submission + AI checking)
│   │   ├── leaderboard.py   (Score aggregation)
│   │   └── doubts.py        (Chat with Kokoro TTS)
│   ├── models/
│   │   ├── student.py       (Student DB model)
│   │   ├── lecture.py       (Lecture DB model)
│   │   ├── quiz.py          (Quiz DB model)
│   │   ├── test.py          (Test DB model)
│   │   └── result.py        (Results/Scores DB model)
│   ├── services/
│   │   ├── aiChecker.py     (Integrate Kokoro for test grading)
│   │   └── tts.py           (Text-to-speech via Kokoro)
│   ├── requirements.txt
│   └── run.py
│
└── DATA/                     (Content files - no code)
    ├── lectures.json         (All lecture topics with speech text)
    ├── quizzes.json          (Quiz questions per topic)
    └── tests.json            (Test papers with answer keys)
```

---

## 📱 User Flows

### 1️⃣ **Student Flow**
```
Login (Class ID) 
  ↓
Dashboard (List lectures/quizzes/tests)
  ├→ Watch Lecture (3D + Audio + Notes)
  ├→ Take Quiz (Multiple choice, immediate feedback)
  ├→ Take Test (Written answers, auto-graded when online)
  ├→ View Leaderboard (Class scores)
  ├→ Ask Doubt (Chatbot, works online only)
  └→ Store results locally (auto-sync when online)
```

### 2️⃣ **Teacher/Admin Flow**
```
Login (Admin credentials)
  ↓
Dashboard (View all classes, students)
  ├→ Manage Classes (Create, edit, view students)
  ├→ View Student Analytics (Progress, test results, areas struggling)
  ├→ Create Lecture (Upload content, speech text, images)
  ├→ Create Quiz (Add questions, options, answer key)
  ├→ View Test Results (Student answers, AI grades)
  └→ Manage Leaderboard (Manual adjustments if needed)
```

---

## 🎬 Feature Breakdown

### **Feature 1: Authentication System**
**Status:** Core Feature
**Implementation Time:** 2 hours

**Components:**
- Student Login: Class ID + Roll Number
- Teacher Login: Admin credentials + Class ID
- Class ID validation (unique key per class)
- Session storage (localStorage for offline)

**Database Schema:**
```
Students:
- id (PK)
- name
- roll_number
- class_id (FK)
- email
- password_hash
- created_at

Classes:
- id (PK)
- class_id_code (unique)
- teacher_id (FK)
- subject
- created_at

Teachers:
- id (PK)
- name
- email
- password_hash
- school_name
- created_at
```

**Endpoints:**
- `POST /api/auth/student-login` → Returns {token, student_id, class_id}
- `POST /api/auth/teacher-login` → Returns {token, teacher_id}
- `POST /api/auth/register-student` → Creates new student
- `POST /api/auth/create-class` → Creates new class with unique ID
- `GET /api/auth/validate-token` → Verify session

---

### **Feature 2: 3D Classroom + Lecturer Avatar**
**Status:** COMPLETED (working)
**Implementation Time:** Already done

**Technical Details:**
- **Engine:** Three.js r160 (ES6 modules, offline)
- **Models:** 
  - basic_classroom.glb (environment)
  - lecturer.glb (with 3 animations)
- **Animations:**
  - Idle (default pose)
  - SpeakingIdle (mouth moving)
  - PointingBack (pointing at whiteboard)
- **Camera:** Fixed view of lecturer from student perspective
- **Lighting:** Ambient + Directional for realistic shadows

**React Integration:**
- Wrap Three.js canvas in `<Classroom />` component
- Props: `{onAnimationChange, currentLecture}`
- Handle animation switching via mixer

---

### **Feature 3: Lecture Player**
**Status:** Core Feature
**Implementation Time:** 4 hours

**Data Format (JSON):**
```json
{
  "lectures": [
    {
      "id": "lec_001",
      "topic": "Photosynthesis - Part 1",
      "grade": "10",
      "subject": "Biology",
      "speech_text": "Photosynthesis is the process by which...",
      "audio_url": "/audios/lec_001.mp3",
      "duration_seconds": 300,
      "captions": [
        {
          "time_start": 0,
          "time_end": 15,
          "text": "Photosynthesis is the process by which..."
        }
      ],
      "notes": "Key points:\n1. Occurs in chloroplasts\n2. Requires light...",
      "images": ["/images/photosynthesis_diagram.jpg"],
      "lecturer_animation": "SpeakingIdle",
      "created_date": "2025-11-20"
    }
  ]
}
```

**UI Components:**
- Video player area (3D classroom)
- Audio player with scrubber
- Caption display (subtitle-style)
- Notes panel (side or below)
- Image gallery (for diagrams)
- Progress bar + timestamp

**Functionality:**
- Auto-play audio when lecture loads
- Sync captions with audio timestamp
- Pause/resume/rewind controls
- Download button (for offline)
- Mark as completed (stored locally)

**Offline Storage:**
- Cache audio files in IndexedDB
- Store lecture metadata in localStorage
- Service Worker for offline access

---

### **Feature 4: Quiz System**
**Status:** Core Feature
**Implementation Time:** 3 hours

**Data Format (JSON):**
```json
{
  "quizzes": [
    {
      "id": "quiz_001",
      "lecture_id": "lec_001",
      "topic": "Photosynthesis - Part 1",
      "passing_score": 60,
      "total_questions": 10,
      "questions": [
        {
          "id": "q_001",
          "text": "What is the primary function of photosynthesis?",
          "type": "multiple_choice",
          "options": [
            "A) Store energy in food molecules",
            "B) Break down glucose",
            "C) Release oxygen only",
            "D) All of the above"
          ],
          "correct_answer": "A",
          "explanation": "Photosynthesis converts light energy into chemical energy..."
        }
      ]
    }
  ]
}
```

**UI Components:**
- Question display (one at a time or all)
- Option buttons (A, B, C, D)
- Progress indicator (Q5/10)
- Timer (optional, per quiz)
- Result screen (score, pass/fail, explanations)

**Functionality:**
- Immediate feedback after each question
- Show correct answer + explanation
- Track attempts (store locally)
- Auto-save progress
- Submit quiz → store result

**Database Schema:**
```
Quizzes:
- id (PK)
- lecture_id (FK)
- topic
- passing_score
- created_at

QuizResults:
- id (PK)
- quiz_id (FK)
- student_id (FK)
- score
- answers_json ({"q_001": "A", ...})
- attempted_at
```

**Endpoints:**
- `GET /api/quizzes?lecture_id=lec_001` → Get quiz for lecture
- `POST /api/quiz-results` → Submit quiz answers
- `GET /api/quiz-results/:student_id` → Get student's quiz history

---

### **Feature 5: Test/Exam System**
**Status:** Core Feature
**Implementation Time:** 5 hours

**Data Format (JSON):**
```json
{
  "tests": [
    {
      "id": "test_001",
      "title": "Photosynthesis Full Test",
      "grade": "10",
      "total_marks": 100,
      "duration_minutes": 60,
      "questions": [
        {
          "id": "q_001",
          "marks": 5,
          "type": "short_answer",
          "text": "Explain the light-dependent reactions.",
          "expected_keywords": ["light", "electron", "ATP", "chlorophyll"],
          "sample_answer": "Light-dependent reactions occur in thylakoid membranes...",
          "rubric": "Award 5 marks if 3+ keywords present, 3 marks for 2 keywords..."
        },
        {
          "id": "q_002",
          "marks": 10,
          "type": "long_answer",
          "text": "Describe the complete process of photosynthesis.",
          "expected_keywords": ["light", "dark", "glucose", "energy"],
          "sample_answer": "Photosynthesis has two main stages...",
          "rubric": "Comprehensive explanation with both stages = 10 marks..."
        }
      ]
    }
  ]
}
```

**UI Components:**
- Test timer (countdown)
- Question display
- Text area for typed answers
- Question navigator (jump to Q#)
- Auto-save indicator
- Submit button (with confirmation)
- Results page (score breakdown, feedback)

**Functionality:**
- Auto-save answers every 30 seconds
- Warn before time runs out
- Prevent submission after time expires
- Submit answers → store locally + queue for sync
- When online: Send to backend for AI grading

**Database Schema:**
```
Tests:
- id (PK)
- title
- total_marks
- duration_minutes
- created_at

TestResults:
- id (PK)
- test_id (FK)
- student_id (FK)
- answers_json ({"q_001": "student's answer...", ...})
- ai_score (null until graded)
- ai_feedback_json
- submitted_at
- graded_at

TestGradingQueue:
- id (PK)
- test_result_id (FK)
- status (pending/grading/completed)
- created_at
```

**Endpoints:**
- `GET /api/tests` → Get all available tests
- `POST /api/test-results` → Submit test answers
- `POST /api/test-results/:id/grade` → Trigger AI grading
- `GET /api/test-results/:student_id` → Get student's test history

**AI Grading Logic (via Kokoro TTS backend):**
- Each answer compared against sample answer + rubric
- Kokoro checks keyword presence + semantic similarity
- Returns: score_awarded, feedback_text
- Stores grade in TestResults.ai_score

---

### **Feature 6: Leaderboard**
**Status:** Secondary Feature
**Implementation Time:** 2 hours

**Data Format:**
- Aggregate all quiz scores + test scores per student
- Calculate class rank
- Display top 10/all students

**UI:**
```
Rank | Student Name    | Points
-----|-----------------|-------
1    | Rajesh Kumar    | 850
2    | Priya Sharma    | 820
3    | Amit Patel      | 795
...
```

**Calculation:**
- Quiz Score = (correct_answers / total_questions) * 100
- Test Score = ai_score (already out of total_marks)
- Total Points = (Quiz Scores Avg) + (Test Scores Avg)

**Database Query:**
```sql
SELECT 
  s.name,
  AVG(qr.score) as avg_quiz_score,
  AVG(tr.ai_score) as avg_test_score,
  (AVG(qr.score) + AVG(tr.ai_score)) as total_points
FROM Students s
LEFT JOIN QuizResults qr ON s.id = qr.student_id
LEFT JOIN TestResults tr ON s.id = tr.student_id
WHERE s.class_id = ?
GROUP BY s.id
ORDER BY total_points DESC;
```

**Endpoints:**
- `GET /api/leaderboard/:class_id` → Get class leaderboard
- `GET /api/leaderboard/:class_id/:student_id` → Get student's position

---

### **Feature 7: Doubts/Chat Bot**
**Status:** Secondary Feature (Online-only)
**Implementation Time:** 2 hours

**UI:**
- Chat interface (message bubbles)
- Text input field
- Send button
- Typing indicator

**Functionality:**
- Student sends question
- Backend routes to Kokoro TTS (from existing AetherCore)
- Kokoro generates response + audio
- Display response + play audio
- Chat history stored locally

**Endpoints:**
- `POST /api/doubts/ask` → Send question
- `GET /api/doubts/history/:student_id` → Get chat history

---

### **Feature 8: Teacher/Admin Dashboard**
**Status:** Secondary Feature
**Implementation Time:** 3 hours

**UI Pages:**
1. **Class Overview:**
   - Student count
   - Average class performance
   - Most attempted topics

2. **Student List:**
   - Name, roll number, enrollment date
   - Link to individual student analytics

3. **Student Analytics (Per Student):**
   - Quiz attempts & scores
   - Test attempts & scores
   - Topics struggled with (low scores)
   - Time spent per lecture
   - Recommendations (auto-generated)

4. **Content Management:**
   - Upload new lectures
   - Create new quizzes
   - Create new tests

**Endpoints:**
- `GET /api/admin/classes/:teacher_id` → Get teacher's classes
- `GET /api/admin/students/:class_id` → Get class students
- `GET /api/admin/student-analytics/:student_id` → Get student details
- `GET /api/admin/class-analytics/:class_id` → Get class stats

---

### **Feature 9: Offline Mode + Sync**
**Status:** Core Infrastructure
**Implementation Time:** 3 hours

**Technology Stack:**
- Service Worker (offline caching)
- IndexedDB (local data storage)
- localStorage (session data)

**What Works Offline:**
- ✅ View all downloaded lectures
- ✅ Take quizzes (score stored locally)
- ✅ Take tests (answers saved locally)
- ✅ View leaderboard (last synced version)
- ❌ Doubt chat (requires internet)
- ❌ Test grading (queued for when online)

**Sync Strategy:**
1. When offline: Store all results locally
2. When online: Service Worker detects connectivity
3. Auto-sync: Send queued results to backend
4. Update: Pull latest leaderboard, test grades, etc.

**IndexedDB Schema:**
```
Stores:
- lectures (key: lecture_id)
- quizzes (key: quiz_id)
- tests (key: test_id)
- quiz_results (key: result_id)
- test_results (key: result_id)
- sync_queue (key: queue_id) -- stores {endpoint, data, timestamp}
```

**Implementation:**
```javascript
// Example: Before offline, download everything
await downloadAllLectures();
await downloadAllQuizzes();
await downloadAllTests();

// Then: When online, sync results
await syncAllResults();

// Auto-detect: Service Worker monitors navigator.onLine
window.addEventListener('online', () => syncAllResults());
```

---

## 🔌 Backend Endpoints (Complete API)

### **Authentication**
- `POST /api/auth/student-login` 
- `POST /api/auth/student-register`
- `POST /api/auth/teacher-login`
- `POST /api/auth/create-class`
- `GET /api/auth/validate-token`
- `POST /api/auth/logout`

### **Content**
- `GET /api/lectures?grade=10&subject=biology` → List all lectures
- `GET /api/lectures/:id` → Get single lecture
- `GET /api/quizzes?lecture_id=lec_001` → Get quiz for lecture
- `GET /api/tests` → Get all tests

### **Results**
- `POST /api/quiz-results` → Submit quiz
- `GET /api/quiz-results/:student_id` → Get student quiz history
- `POST /api/test-results` → Submit test answers
- `GET /api/test-results/:student_id` → Get student test history
- `POST /api/test-results/:id/grade` → Trigger AI grading

### **Leaderboard**
- `GET /api/leaderboard/:class_id` → Class leaderboard
- `GET /api/leaderboard/:class_id/:student_id` → Student position

### **Doubts**
- `POST /api/doubts/ask` → Send question (uses Kokoro)
- `GET /api/doubts/history/:student_id` → Chat history

### **Admin**
- `GET /api/admin/students/:class_id` → Get class students
- `GET /api/admin/student-analytics/:student_id` → Student details
- `GET /api/admin/class-analytics/:class_id` → Class stats
- `POST /api/admin/lectures` → Create new lecture
- `POST /api/admin/quizzes` → Create new quiz
- `POST /api/admin/tests` → Create new test

---

## 💾 Data Files Needed

### **1. lectures.json** (Sample with 5 lectures)
```json
{
  "lectures": [
    {
      "id": "lec_001",
      "topic": "Photosynthesis - Part 1",
      "grade": "10",
      "subject": "Biology",
      "speech_text": "[Full speech transcript]",
      "audio_url": "/audios/lec_001.mp3",
      "duration_seconds": 300,
      "captions": [...],
      "notes": "Key points:\n1. ...",
      "images": ["/images/photo_1.jpg"]
    }
  ]
}
```

### **2. quizzes.json** (Sample with 3 quizzes)
```json
{
  "quizzes": [
    {
      "id": "quiz_001",
      "lecture_id": "lec_001",
      "topic": "Photosynthesis - Part 1",
      "questions": [
        {
          "id": "q_001",
          "text": "What is photosynthesis?",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correct_answer": "A",
          "explanation": "..."
        }
      ]
    }
  ]
}
```

### **3. tests.json** (Sample with 1 test)
```json
{
  "tests": [
    {
      "id": "test_001",
      "title": "Photosynthesis Full Test",
      "questions": [
        {
          "id": "q_001",
          "marks": 5,
          "type": "short_answer",
          "text": "Explain photosynthesis.",
          "expected_keywords": ["light", "energy"],
          "sample_answer": "..."
        }
      ]
    }
  ]
}
```

---

## 🛠️ Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 18 + Vite | Fast dev, great ecosystem, mobile-friendly |
| **3D Graphics** | Three.js r160 (offline) | Runs locally, no internet needed |
| **Styling** | Tailwind CSS | Quick UI building |
| **State Mgmt** | React Context + useReducer | Simple, no extra dependencies |
| **Offline Storage** | IndexedDB + Service Worker | Browser-native, large capacity |
| **Backend** | Flask | Python (existing Kokoro integration) |
| **Database** | MySQL | Persistent, relational data |
| **TTS/AI** | Kokoro (existing) | Already built, just integrate |
| **Testing** | Vitest | Fast, integrated with Vite |

---

## 📅 Implementation Schedule (56 Hours)

### **Phase 1: Setup & Foundation (6 hours)**
- [ ] Initialize React + Vite project
- [ ] Setup folder structure & basic routing
- [ ] Configure Tailwind CSS
- [ ] Setup Flask backend with MySQL
- [ ] Create database schema
- **Assignable to Leader:** Database schema setup, basic API scaffolding

### **Phase 2: Core Features (24 hours)**
- [ ] **3D Classroom Integration** (2 hrs)
- [ ] **Lecture Player** (4 hrs) ← Can be split between you & leader
- [ ] **Quiz System** (3 hrs) ← Can be split
- [ ] **Test System** (5 hrs) ← Can be split
- [ ] **Authentication** (2 hrs)
- [ ] **Leaderboard** (2 hrs)
- [ ] **Basic Teacher Dashboard** (2 hrs)
- [ ] **Sample Data Creation** (2 hrs) ← Good for leader
- [ ] **API Endpoints** (4 hrs) ← Good for leader
- **Assignable to Leader:** 
  - Sample data JSON files
  - API endpoints for lectures, quizzes, tests
  - Quiz result storage
  - Leaderboard queries

### **Phase 3: Offline + Polish (18 hours)**
- [ ] **Service Workers Setup** (2 hrs)
- [ ] **IndexedDB Implementation** (2 hrs)
- [ ] **Offline Sync Logic** (2 hrs)
- [ ] **Bug Fixes** (4 hrs)
- [ ] **UI Polish** (4 hrs)
- [ ] **Testing** (2 hrs)
- [ ] **Documentation** (2 hrs)
- **Assignable to Leader:**
  - Documentation
  - Sample audio files (can use text-to-speech from Kokoro)
  - UI bug fixes & styling

### **Phase 4: Hackathon (8 hours)**
- [ ] Final testing
- [ ] Demo preparation
- [ ] Video recording (optional)
- [ ] Submission

---

## ⚡ Quick Win Features (For Extra Time)

If you finish early:
1. **Doubt Chat** (2 hrs) - Full integration with Kokoro
2. **Advanced Analytics** (2 hrs) - Charts showing student progress
3. **Mobile Optimization** (2 hrs) - Responsive design
4. **Dark Mode** (1 hr) - Toggle theme
5. **Better Teacher Dashboard** (2 hrs) - More detailed analytics

---

## 🤝 How Your Leader Can Help

**High-Value Tasks (Best ROI):**
1. **Create Sample Data** (lectures.json, quizzes.json, tests.json with 10+ entries each) - 3 hours
2. **Build Backend API Endpoints** (Flask routes for quiz/test results) - 4 hours
3. **Database Queries** (SQL for leaderboard, analytics) - 2 hours
4. **Generate Audio Files** (Use Kokoro to create lecture audio files) - 2 hours
5. **UI Polish & Testing** (CSS fixes, responsive design) - 3 hours

**Medium-Value Tasks:**
- Teacher Dashboard implementation - 2 hours
- Doubt chat backend integration - 2 hours
- Documentation & deployment guides - 2 hours

**Low-Value Tasks (Don't assign):**
- Individual component styling (too granular)
- Minor bug fixes
- Small UI tweaks

---

## ✅ Definition of Done

**MVP is complete when:**
- ✅ Student can login with Class ID
- ✅ Student can watch 3+ lectures with 3D avatar
- ✅ Student can take 3+ quizzes and see scores
- ✅ Student can take 1+ test and see results (stored locally first, graded when online)
- ✅ All data works 100% offline after first download
- ✅ When online, results auto-sync to backend
- ✅ Teacher can login and see student progress
- ✅ Leaderboard shows top students in class
- ✅ Basic UI is clean and mobile-friendly
- ✅ No errors in console, all features functional

---

## 🚀 Success Metrics

1. **Technical:** 
   - 0 console errors
   - All 9 features working
   - 100% offline capability
   - Auto-sync working

2. **User Experience:**
   - Can complete full student journey in 5 minutes
   - Teacher can see student analytics in < 30 seconds
   - Responsive on mobile (320px - 1920px)

3. **Presentation:**
   - Clear demo of 3D lecturer teaching
   - Show offline mode working
   - Demo quiz/test with scoring
   - Show leaderboard updating in real-time

---

## 📞 Questions for Your Leader?

Ask her to focus on:
1. Database design & schema validation
2. Sample data creation (realistic, diverse)
3. Backend API implementation
4. Audio file generation (using Kokoro)
5. Testing & QA

**NOT on:**
- React component details
- Three.js integration
- Offline caching logic (complex, better to keep with main dev)

---

**Last Updated:** Nov 26, 2025
**Status:** Ready for Development
