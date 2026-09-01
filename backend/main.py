from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import videos, alerts, cameras

# Create tables
Base.metadata.create_all(bind=engine)
app = FastAPI(title="VeerDrishti Border Ops API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

app.include_router(videos.router)
app.include_router(alerts.router)
app.include_router(cameras.router)
from routes import audit
app.include_router(audit.router)

os.makedirs("evidence", exist_ok=True)
app.mount("/evidence", StaticFiles(directory="evidence"), name="evidence")

@app.get("/")
def read_root():
    return {"message": "Welcome to VeerDrishti Border Ops API"}
