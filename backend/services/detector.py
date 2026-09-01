import cv2
from ultralytics import YOLO
import math

class YOLODetector:
    def __init__(self, model_path="yolov8n.pt"):
        # Load YOLOv8 model (downloads automatically if not present)
        self.model = YOLO(model_path)
        self.classNames = self.model.names

    def detect(self, frame):
        # Run inference on the frame
        results = self.model(frame, stream=True, verbose=False)
        detections = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                # Bounding box
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                
                # Confidence
                conf = math.ceil((box.conf[0] * 100)) / 100
                
                # Class Name
                cls = int(box.cls[0])
                class_name = self.classNames[cls]

                detections.append({
                    "box": [x1, y1, x2, y2],
                    "confidence": conf,
                    "class": class_name,
                    "class_id": cls
                })
        return detections
