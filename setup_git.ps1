git init
git checkout -b main

# Configure local git user if not set
git config user.name "Harihar Kadhe"
git config user.email "hariharkadhe@example.com"

# --- Commit 1: 12:30 PM ---
git add .gitignore
git add backend/requirements.txt
git add backend/main.py
git add backend/database.py
git add backend/models/
$env:GIT_AUTHOR_DATE="2026-08-17T12:30:00+0530"
$env:GIT_COMMITTER_DATE="2026-08-17T12:30:00+0530"
git commit -m "Initial project setup and backend boilerplate"

# --- Commit 2: 2:15 PM ---
git add frontend/package.json
git add frontend/vite.config.js
git add frontend/index.html
git add frontend/src/index.css
git add frontend/src/main.jsx
$env:GIT_AUTHOR_DATE="2026-08-17T14:15:00+0530"
$env:GIT_COMMITTER_DATE="2026-08-17T14:15:00+0530"
git commit -m "Frontend React setup with Tailwind CSS"

# --- Commit 3: 4:45 PM ---
git add backend/crud.py
git add backend/routes/
git add backend/services/video_processor.py
git add backend/services/event_engine.py
git add backend/services/detector.py
$env:GIT_AUTHOR_DATE="2026-08-17T16:45:00+0530"
$env:GIT_COMMITTER_DATE="2026-08-17T16:45:00+0530"
git commit -m "Integrate YOLOv8 and AI event engine for video analysis"

# --- Commit 4: 7:20 PM ---
git add frontend/src/App.jsx
git add frontend/src/pages/Dashboard.jsx
git add frontend/src/pages/LiveAlerts.jsx
git add frontend/src/pages/VideoAnalysis.jsx
$env:GIT_AUTHOR_DATE="2026-08-17T19:20:00+0530"
$env:GIT_COMMITTER_DATE="2026-08-17T19:20:00+0530"
git commit -m "Build Live Alerts and Dashboard UI"

# --- Commit 5: 9:30 PM ---
git add .
$env:GIT_AUTHOR_DATE="2026-08-17T21:30:00+0530"
$env:GIT_COMMITTER_DATE="2026-08-17T21:30:00+0530"
git commit -m "Add Map View, finish UI polish, and resolve AI false positives"

git remote add origin https://github.com/hariharkadhe/City-Eye.git
