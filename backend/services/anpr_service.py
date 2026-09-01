# Mock ANPR (Automatic Number Plate Recognition) Service
# For a production system, this would integrate with EasyOCR or Tesseract
import random
import re

class ANPRService:
    def __init__(self):
        self.suspect_plates = {
            "HR26DK8392": "Wanted for suspected smuggling",
            "DL1C9384": "Stolen vehicle report",
            "UP16AZ9922": "Known cross-border operative"
        }
        
    def extract_plate(self, frame_crop):
        # In a real scenario, run OCR model on the frame crop
        # For prototyping, we randomly simulate plate reads based on vehicle detection
        
        plates = ["HR26DK8392", "DL1C9384", "UP16AZ9922", "MH31CB1234", "WB12AB3456", "UNKNOWN"]
        # Bias towards normal plates, but occasionally flag suspect plates
        weights = [0.05, 0.05, 0.05, 0.3, 0.3, 0.25]
        
        detected_plate = random.choices(plates, weights=weights, k=1)[0]
        
        if detected_plate == "UNKNOWN":
            return None, "Plate illegible/missing"
            
        return detected_plate, self.check_suspect_db(detected_plate)
        
    def check_suspect_db(self, plate_number):
        # Clean the plate string
        clean_plate = re.sub(r'[^A-Z0-9]', '', str(plate_number).upper())
        
        if clean_plate in self.suspect_plates:
            return {
                "flagged": True,
                "reason": self.suspect_plates[clean_plate],
                "severity": "Critical"
            }
        return {
            "flagged": False,
            "reason": "Clear",
            "severity": "Low"
        }

anpr_service = ANPRService()
