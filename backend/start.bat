@echo off
cd /d "%~dp0"
pip install -r requirements.txt
python seed_data.py
uvicorn main:app --reload --port 8000
