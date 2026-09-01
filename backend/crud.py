from sqlalchemy.orm import Session
from models import models, schemas
from datetime import datetime

def get_camera(db: Session, camera_id: str):
    return db.query(models.Camera).filter(models.Camera.camera_id == camera_id).first()

def get_cameras(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Camera).offset(skip).limit(limit).all()

def create_camera(db: Session, camera: schemas.CameraCreate):
    db_camera = models.Camera(**camera.model_dump())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

def get_videos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Video).offset(skip).limit(limit).all()

def create_video(db: Session, video: schemas.VideoCreate):
    db_video = models.Video(**video.model_dump())
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.BorderEvent).order_by(models.BorderEvent.timestamp.desc()).offset(skip).limit(limit).all()

def get_event(db: Session, event_id: int):
    return db.query(models.BorderEvent).filter(models.BorderEvent.id == event_id).first()

def create_event(db: Session, event: schemas.BorderEventCreate):
    db_event = models.BorderEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event_status(db: Session, event_id: int, status: str):
    db_event = get_event(db, event_id)
    if db_event:
        db_event.status = status
        db.commit()
        db.refresh(db_event)
    return db_event

def create_event_action(db: Session, action: schemas.EventActionCreate):
    db_action = models.EventAction(**action.model_dump())
    db.add(db_action)
    db.commit()
    db.refresh(db_action)
    return db_action

def delete_event(db: Session, event_id: int):
    event = db.query(models.BorderEvent).filter(models.BorderEvent.id == event_id).first()
    if event:
        db.delete(event)
        db.commit()
        return True
    return False

def create_threat_log(db: Session, log: schemas.ThreatLogCreate):
    db_log = models.ThreatLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_threat_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ThreatLog).order_by(models.ThreatLog.timestamp.desc()).offset(skip).limit(limit).all()

def create_audit_chain(db: Session, audit: schemas.AuditChainCreate):
    db_audit = models.AuditChain(**audit.model_dump())
    db.add(db_audit)
    db.commit()
    db.refresh(db_audit)
    return db_audit
