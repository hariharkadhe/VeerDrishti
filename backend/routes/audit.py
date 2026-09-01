from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import models

router = APIRouter(prefix="/audit", tags=["Audit Chain"])

@router.get("/")
def get_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(models.AuditChain).order_by(models.AuditChain.timestamp.desc()).offset(skip).limit(limit).all()
    return logs
