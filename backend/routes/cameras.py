from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import schemas
import crud

router = APIRouter(prefix="/cameras", tags=["Cameras"])

@router.get("/", response_model=list[schemas.Camera])
def get_cameras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_cameras(db, skip=skip, limit=limit)

@router.get("/{camera_id}", response_model=schemas.Camera)
def get_camera(camera_id: str, db: Session = Depends(get_db)):
    return crud.get_camera(db, camera_id=camera_id)

@router.post("/", response_model=schemas.Camera)
def create_camera(camera: schemas.CameraCreate, db: Session = Depends(get_db)):
    return crud.create_camera(db=db, camera=camera)
