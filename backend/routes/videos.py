import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import schemas
import crud
import shutil
from datetime import datetime

router = APIRouter(prefix="/videos", tags=["Videos"])
UPLOAD_DIR = "uploads"

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=schemas.Video)
async def upload_video(
    camera_id: str, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(('.mp4', '.avi', '.mov')):
        raise HTTPException(status_code=400, detail="Invalid file format")
    
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Check if camera exists, if not create mock camera
    camera = crud.get_camera(db, camera_id)
    if not camera:
        crud.create_camera(db, schemas.CameraCreate(
            camera_id=camera_id, 
            location="Unknown Location"
        ))

    video_data = schemas.VideoCreate(
        filename=safe_filename,
        camera_id=camera_id,
        status="Uploaded"
    )
    
    return crud.create_video(db, video_data)

from fastapi import BackgroundTasks
from services.video_processor import VideoProcessor
import os

processor = VideoProcessor()

@router.post("/{video_id}/analyze")
async def analyze_video(video_id: int, background_tasks: BackgroundTasks, detection_type: str = "all", db: Session = Depends(get_db)):
    video = crud.get_videos(db)
    video_record = next((v for v in video if v.id == video_id), None)
    if not video_record:
        raise HTTPException(status_code=404, detail="Video not found")
        
    file_path = os.path.join(UPLOAD_DIR, video_record.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video file missing")
        
    # Start analysis in background
    video_record.status = "Analyzing"
    db.commit()
    background_tasks.add_task(processor.process_video, video_id, file_path, detection_type)
    
    return {"message": "Analysis started"}

@router.get("/{video_id}/evidence")
def get_video_evidence(video_id: int):
    evidence_dir = "evidence"
    if not os.path.exists(evidence_dir):
        return []
    
    images = []
    for filename in os.listdir(evidence_dir):
        if filename.startswith(f"ev_{video_id}_") and filename.endswith(".jpg"):
            images.append(f"http://localhost:8000/evidence/{filename}")
            
    return images

@router.get("/", response_model=list[schemas.Video])
def list_videos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_videos(db, skip=skip, limit=limit)
