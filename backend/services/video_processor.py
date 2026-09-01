import cv2
import os
import crud
from models import schemas
from sqlalchemy.orm import Session
from .detector import YOLODetector
from .event_engine import EventEngine
from datetime import datetime
import asyncio

from database import SessionLocal

class VideoProcessor:
    def __init__(self):
        self.detector = YOLODetector()
        
    def process_video(self, video_id: int, file_path: str, detection_type: str):
        db = SessionLocal()
        try:
            engine = EventEngine()
            cap = cv2.VideoCapture(file_path)
            
            if not cap.isOpened():
                print(f"Error opening video file {file_path}")
                return
                
            # Get video metadata
            video = crud.get_videos(db, skip=0, limit=1000) # simplified find
            video_record = next((v for v in video if v.id == video_id), None)
            if not video_record:
                return
                
            camera_id = video_record.camera_id
            camera = crud.get_camera(db, camera_id)
            location = camera.location if camera else "Unknown"
    
            fps = cap.get(cv2.CAP_PROP_FPS)
            # Process ~2 fps for maximum performance on CPU
            frame_skip = int(fps / 2) if fps > 2 else 1 
            
            frame_num = 0
            detected_types = set()
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                    
                frame_num += 1
                if frame_num % frame_skip != 0:
                    continue

                # Resize frame to reduce CPU load on inference
                # YOLO handles resizing, but passing a smaller array speeds up the pipeline
                small_frame = cv2.resize(frame, (640, 480))
    
                # Detect
                detections = self.detector.detect(small_frame)
                
                # Process Events
                events = engine.process_frame(detections, frame_num, detection_type)
                
                for event in events:
                    if event['type'] in detected_types:
                        continue
                    detected_types.add(event['type'])
                    # 1. Generate Evidence Image
                    timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S")
                    safe_type = event['type'].replace(' ', '_').replace('-', '')
                    evidence_filename = f"ev_{video_id}_{frame_num}_{safe_type}_{timestamp_str}.jpg"
                    evidence_dir = "evidence"
                    os.makedirs(evidence_dir, exist_ok=True)
                    evidence_path = os.path.join(evidence_dir, evidence_filename)
                    
                    # Draw bounding box for evidence
                    ev_frame = frame.copy()
                    if event['box']:
                        x1, y1, x2, y2 = event['box']
                        cv2.rectangle(ev_frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                        cv2.putText(ev_frame, f"{event['type']} ({event['confidence']})", 
                                    (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                    else:
                        cv2.putText(ev_frame, f"{event['type']} DETECTED", 
                                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 3)
                                    
                    cv2.imwrite(evidence_path, ev_frame)
                    
                    # 2. Create Alert in DB
                    alert_data = schemas.BorderEventCreate(
                        event_type=event['type'],
                        camera_id=camera_id,
                        location=location,
                        confidence=event['confidence'],
                        severity=event['severity'],
                        evidence_path=evidence_path,
                        status="NEW"
                    )
                    new_event = crud.create_event(db, alert_data)
                    
                    # 3. Log to Audit Blockchain
                    from services.audit_chain import audit_service
                    audit_service.log_action(db, event_id=new_event.id, action_type=f"Threat Detected: {event['type']}", operator_id="AUTO-AI")
                    
            cap.release()
            
            # Update video status
            if video_record:
                video_record.status = "Completed"
                db.commit()
                
        finally:
            db.close()
