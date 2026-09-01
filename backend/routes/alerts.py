from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import schemas
import crud

router = APIRouter(prefix="/alerts", tags=["Threat Alerts"])

@router.get("/", response_model=list[schemas.BorderEvent])
def get_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_events(db, skip=skip, limit=limit)

@router.get("/{alert_id}", response_model=schemas.BorderEvent)
def get_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = crud.get_event(db, event_id=alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.post("/{alert_id}/acknowledge", response_model=schemas.BorderEvent)
def acknowledge_alert(alert_id: int, operator: str = "Operator1", db: Session = Depends(get_db)):
    alert = crud.update_event_status(db, alert_id, "ACKNOWLEDGED")
    crud.create_event_action(db, schemas.EventActionCreate(event_id=alert_id, action="Acknowledged", operator=operator))
    return alert

@router.post("/{alert_id}/dispatch", response_model=schemas.BorderEvent)
def dispatch_alert(alert_id: int, operator: str = "Operator1", db: Session = Depends(get_db)):
    alert = crud.update_event_status(db, alert_id, "DISPATCHED")
    crud.create_event_action(db, schemas.EventActionCreate(event_id=alert_id, action="Dispatched", operator=operator))
    return alert

@router.post("/{alert_id}/close", response_model=schemas.BorderEvent)
def close_alert(alert_id: int, operator: str = "Operator1", db: Session = Depends(get_db)):
    alert = crud.update_event_status(db, alert_id, "CLOSED")
    crud.create_event_action(db, schemas.EventActionCreate(event_id=alert_id, action="Closed", operator=operator))
    return alert

@router.delete("/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    if crud.delete_event(db, alert_id):
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Alert not found")
