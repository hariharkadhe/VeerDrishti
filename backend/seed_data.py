from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
from models import schemas
import crud
import random
from datetime import datetime, timedelta

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create Cameras (Border Outposts - SSB)
    cameras = [
        {"camera_id": "BOP-IND-NEP-001", "location": "Sonauli Border Crossing, UP", "lat": 27.4727, "lon": 83.4735, "rtsp_url": "rtsp://mock-cam-1/live"},
        {"camera_id": "BOP-IND-NEP-002", "location": "Raxaul Border, Bihar", "lat": 26.9856, "lon": 84.8465, "rtsp_url": "rtsp://mock-cam-2/live"},
        {"camera_id": "BOP-IND-BTN-001", "location": "Jaigaon Checkpost, WB", "lat": 26.8580, "lon": 89.3800, "rtsp_url": "rtsp://mock-cam-3/live"},
        {"camera_id": "BOP-IND-NEP-003", "location": "Banbasa Barrage, UK", "lat": 28.9830, "lon": 80.0830, "rtsp_url": "rtsp://mock-cam-4/live"}
    ]

    for c in cameras:
        existing = crud.get_camera(db, c["camera_id"])
        if not existing:
            crud.create_camera(db, schemas.CameraCreate(
                camera_id=c["camera_id"],
                location=c["location"],
                latitude=c["lat"],
                longitude=c["lon"],
                status="Online",
                rtsp_url=c["rtsp_url"]
            ))

    db.close()
    print("Database seeded with sample BOP cameras.")

if __name__ == "__main__":
    seed_db()
