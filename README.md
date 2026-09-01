# 🦅 VeerDrishti: Autonomous Tactical Border Operations Center

**VeerDrishti** is an advanced, AI-driven tactical intelligence command center designed for rapid border threat detection, drone classification, and localized rapid-response deployments.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

## 🎯 Core Capabilities

- **Real-Time Threat Detection:** Ingests live video feeds (RTSP/MP4) from border outposts (BOPs) and applies YOLOv8 object detection.
- **Autonomous Threat Classification:** The AI engine classifies events such as *Border Intrusions*, *Smuggling Attempts*, *Unauthorized Vehicles*, and *Unidentified Drones*.
- **Cryptographic Audit Ledger:** All critical events are hashed and logged to an immutable Blockchain-style ledger, ensuring zero evidence tampering by malicious actors.
- **Tactical Dashboard:** A neon-green, military-grade glassmorphism UI designed for high-stress operational environments.

## ⚙️ Tech Stack

### 1. FRONTEND
* **Technologies:** React.js (Vite), JavaScript, Tailwind CSS, Recharts
* **Purpose:** Responsive, high-contrast tactical dashboard with custom CRT animations and real-time polling.

### 2. BACKEND
* **Technologies:** Python, FastAPI, Uvicorn
* **Purpose:** Asynchronous API supporting simultaneous camera feeds and rapid alert processing.

### 3. AI / COMPUTER VISION
* **Technologies:** YOLOv8 / YOLO11, OpenCV
* **Purpose:** Ultra-fast local edge computing for object detection, minimizing latency in austere border environments.

### 4. STORAGE & DATABASE
* **Technologies:** SQLite, SQLAlchemy ORM
* **Purpose:** Offline-first architecture allowing Border Outposts to retain critical data when central communications are jammed or severed.

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.10+
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hariharkadhe/VeerDrishti.git
   cd VeerDrishti
   ```

2. **Start the Backend Intelligence Server:**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Start the Frontend Tactical UI:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Command Center:**
   Open your browser and navigate to `http://localhost:5173/`

## 🛡️ License
Classified military software. For demonstration purposes only.
