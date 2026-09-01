from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CameraBase(BaseModel):
    camera_id: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = "Online"
    rtsp_url: Optional[str] = None

class CameraCreate(CameraBase):
    pass

class Camera(CameraBase):
    id: int
    last_analysis: datetime

    class Config:
        from_attributes = True

class VideoBase(BaseModel):
    filename: str
    camera_id: str
    status: Optional[str] = "Uploaded"

class VideoCreate(VideoBase):
    pass

class Video(VideoBase):
    id: int
    duration: Optional[float] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True

class BorderEventBase(BaseModel):
    event_type: str
    camera_id: str
    location: str
    confidence: float
    severity: str
    evidence_path: Optional[str] = None
    status: Optional[str] = "NEW"
    timestamp: Optional[datetime] = None

class BorderEventCreate(BorderEventBase):
    pass

class BorderEvent(BorderEventBase):
    id: int
    timestamp: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class EventActionBase(BaseModel):
    action: str
    operator: str

class EventActionCreate(EventActionBase):
    event_id: int

class EventAction(EventActionBase):
    id: int
    event_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class ThreatLogBase(BaseModel):
    threat_level: str
    description: str
    operator: str

class ThreatLogCreate(ThreatLogBase):
    pass

class ThreatLog(ThreatLogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class AuditChainBase(BaseModel):
    event_id: Optional[int] = None
    action_type: str
    operator_id: str
    hash_value: str
    previous_hash: str

class AuditChainCreate(AuditChainBase):
    pass

class AuditChain(AuditChainBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
