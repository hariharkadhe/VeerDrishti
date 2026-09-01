from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String, unique=True, index=True)
    location = Column(String)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String, default="Online")
    rtsp_url = Column(String, nullable=True)
    last_analysis = Column(DateTime, default=datetime.utcnow)

    videos = relationship("Video", back_populates="camera")
    events = relationship("BorderEvent", back_populates="camera")

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
    camera_id = Column(String, ForeignKey("cameras.camera_id"))
    duration = Column(Float, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Uploaded")

    camera = relationship("Camera", back_populates="videos")

class BorderEvent(Base):
    __tablename__ = "border_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True) # Intrusion, Drone, Smuggling, etc.
    camera_id = Column(String, ForeignKey("cameras.camera_id"))
    location = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    confidence = Column(Float)
    severity = Column(String) # Critical, High, Medium, Low
    evidence_path = Column(String, nullable=True)
    status = Column(String, default="NEW") # NEW, ACKNOWLEDGED, DISPATCHED, CLOSED
    created_at = Column(DateTime, default=datetime.utcnow)

    camera = relationship("Camera", back_populates="events")
    actions = relationship("EventAction", back_populates="event")

class EventAction(Base):
    __tablename__ = "event_actions"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("border_events.id"))
    action = Column(String) # Acknowledged, Dispatched, Closed
    operator = Column(String, default="System")
    timestamp = Column(DateTime, default=datetime.utcnow)

    event = relationship("BorderEvent", back_populates="actions")

class ThreatLog(Base):
    __tablename__ = "threat_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    threat_level = Column(String) # DEFCON levels
    description = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    operator = Column(String)

class AuditChain(Base):
    __tablename__ = "audit_chains"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("border_events.id"), nullable=True)
    action_type = Column(String)
    operator_id = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    hash_value = Column(String, index=True)
    previous_hash = Column(String)
