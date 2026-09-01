# VeerDrishti: Autonomous Border Surveillance Platform - Complete Architecture Guide

## 1. Project Overview
**VeerDrishti** is a tactical, AI-driven border surveillance and threat detection platform. It is designed to act as the digital nervous system for Border Outposts (BOPs) and Central Command. By ingesting live RTSP video feeds from CCTV cameras and autonomous drones, the system uses an ensemble of advanced computer vision models to detect perimeter intrusions, unauthorized vehicles, and suspected smuggling activities in real-time.

All detected events are logged into an immutable cryptographic hash chain (Audit Blockchain) to ensure tamper-proof record-keeping, and the global threat level can be controlled via a centralized Tactical Ops Center.

---

## 2. Core Detection Capabilities & AI Models

The intelligence engine of VeerDrishti is modular, utilizing specific AI techniques for different threat vectors.

### A. Advanced Object Detection (Personnel, Drones, Contraband)
The primary vision engine relies on the **YOLO (You Only Look Once)** architecture to identify entities in a frame.
* **Capabilities:** Detects humans (for perimeter intrusion), drones (UAVs crossing airspace), suspected smuggling equipment (backpacks, duffel bags), and weapons.
* **YOLOv8 (Currently Implemented):** We use YOLOv8 because it is the **workhorse of edge computing**. Border Outposts (BOPs) often require inference to be run on local, low-power edge devices (like NVIDIA Jetson Nanos) rather than uploading heavy video feeds to the cloud. YOLOv8 exports perfectly to **TensorRT** for highly optimized, low-latency inference on the edge.
* **YOLO11 (Future Upgrade):** YOLO11 boasts refined architectures for even higher accuracy, especially for distant or camouflaged objects (e.g., small drones at night). While its edge-deployment ecosystem is still maturing, VeerDrishti is designed to hot-swap model weights to YOLO11 in the future to increase detection confidence.

### B. Automatic Number Plate Recognition (ANPR)
When vehicles approach border checkpoints, relying solely on object detection isn't enough; the system must identify the specific vehicle.
* **Capabilities:** Reads the license plates of vehicles passing through the BOP cameras and cross-references them against a watchlist of unauthorized or flagged vehicles.
* **Technology:** This utilizes a two-step pipeline: first, a targeted YOLO model detects the bounding box of the license plate itself. Then, an **Optical Character Recognition (OCR)** model (like Tesseract or a lightweight TrOCR) extracts the alphanumeric text from that cropped bounding box.

### C. Intrusion Detection (Virtual Tripwires)
Detecting a person is only half the battle; the system needs to know if that person crossed a restricted boundary.
* **Capabilities:** Operators can draw virtual polygons or "tripwires" over the camera feed (e.g., drawing a line over the physical border fence).
* **Technology:** The engine calculates the centroid (center point) of a detected human's bounding box. Using mathematical ray-casting algorithms, it determines if that centroid intersects or crosses the designated virtual tripwire coordinates. If it does, a `Perimeter Intrusion` alert is fired immediately.

---

## 3. System Architecture & Tech Stack

### Frontend (Tactical Ops Command)
* **Framework:** React.js powered by Vite
* **Styling:** Tailwind CSS (Vanilla CSS for custom tactical animations)
* **Icons & Maps:** Lucide-React, React-Leaflet
* **Why this stack?** React allows for a highly modular, component-based UI that can handle rapid state changes (like incoming live alerts). Tailwind CSS, heavily customized with neon glows (`#39ff14`), CRT scanlines, and radar sweep animations, achieves the high-contrast "military/tactical" aesthetic required for a command center.

### Backend (Stream Ingestion & Processing)
* **Framework:** FastAPI (Python)
* **Video Ingestion:** OpenCV (cv2)
* **Why this stack?** FastAPI is asynchronous and incredibly fast, making it the perfect choice for ingesting multiple continuous IP camera feeds via the **RTSP (Real-Time Streaming Protocol)**. Python is also the native language for AI/ML ecosystems, allowing seamless integration with the YOLO and OCR models.

---

## 4. Database Architecture: SQLite vs. PostgreSQL

The system uses **SQLAlchemy** (an ORM), meaning the underlying database can be swapped effortlessly without rewriting SQL queries. However, the architectural strategy involves both SQLite and PostgreSQL at different tiers of the deployment.

### SQLite (Current Prototype & Edge Node Tier)
* **Definition:** A C-language library that implements a small, fast, self-contained SQL database engine without a separate server process.
* **Role in VeerDrishti:** 
  1. **Rapid Prototyping:** It allows developers to run this project instantly without configuring external servers.
  2. **Edge Resilience:** In actual deployment, internet connectivity at remote border sectors is often severed. Each BOP runs a local instance of the application using **SQLite**. If the outpost is cut off from Central Command, it continues to operate, detect threats, and log them locally to SQLite. When the connection is restored, the local database syncs its data to the HQ server.

### PostgreSQL (Central Command Tier)
* **Definition:** A powerful, open-source object-relational database system known for reliability under high concurrent workloads.
* **Role in VeerDrishti:** 
  For the **Central Command (HQ) Server**, which ingests data from hundreds of different Border Outposts simultaneously, PostgreSQL is mandatory.
  1. **Concurrency:** It handles thousands of simultaneous write operations (alerts streaming in) without database locks.
  2. **PostGIS:** PostgreSQL supports the PostGIS extension, allowing for incredibly complex geospatial queries (e.g., "Find all drone intrusions within 5 kilometers of Sector 4 in the last 72 hours"), which is critical for the Sector Map and Threat Analytics features.

---

## 5. Security & Integrity Modules

### The Audit Blockchain (Cryptographic Hash Chain)
In military and border security applications, data integrity is paramount. A malicious insider must not be able to delete a threat log to cover up an infiltration.
* **How it works:** Every time an event is logged (e.g., a threat detected, or a DEFCON level changed), an entry is added to the `AuditChain` table.
* **SHA-256 Hashing:** Each new log generates a SHA-256 cryptographic hash based on its own data **plus the hash of the previous log entry** (identical to how blockchain works). If a hacker manually deletes or alters a database row, the subsequent hashes will break, immediately alerting administrators to the tampering.

### Tactical Threat Center
* **Capabilities:** A global DEFCON protocol selector that allows administrators to change the readiness state of the sector (from `NORMAL` to `CRITICAL`).
* **Automated Countermeasures:** Elevating the threat level can trigger automated responses across the network, such as locking down outpost gates, sounding perimeter alarms, or scrambling automated drone swarms to the last known coordinates of a threat.
