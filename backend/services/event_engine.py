from datetime import datetime

class EventEngine:
    def __init__(self):
        # State tracking for temporal confirmation
        self.person_history = []
        self.drone_detections = 0
        self.vehicle_detections = 0
        
        # Configs
        self.INTRUSION_THRESHOLD = 1
        self.TEMPORAL_FRAMES = 5

    def process_frame(self, detections, frame_num, detection_type="all"):
        events = []
        
        persons = [d for d in detections if d['class'] == 'person']
        backpacks = [d for d in detections if d['class'] in ('backpack', 'suitcase', 'handbag')]
        vehicles = [d for d in detections if d['class'] in ('car', 'truck', 'motorcycle', 'bus')]
        drones = [d for d in detections if d['class'] in ('airplane', 'bird', 'kite', 'drone')] # Using COCO proxies for drones
        
        # 1. Intrusion Detection (Person in restricted zone)
        if detection_type in ["all", "intrusion"]:
            self.person_history.append(len(persons))
            if len(self.person_history) > self.TEMPORAL_FRAMES:
                self.person_history.pop(0)
                
            if sum(self.person_history) / self.TEMPORAL_FRAMES >= self.INTRUSION_THRESHOLD:
                events.append({
                    "type": "Border Intrusion Detected",
                    "severity": "Critical",
                    "confidence": max([p['confidence'] for p in persons]) if persons else 0.85,
                    "box": None if not persons else persons[0]['box']
                })
                self.person_history = [] 
            
        # 2. Smuggling Detection (Person + Backpack)
        if detection_type in ["all", "smuggling"]:
            for p in persons:
                px1, py1, px2, py2 = p['box']
                for b in backpacks:
                    bx1, by1, bx2, by2 = b['box']
                    ix = max(px1, bx1)
                    iy = max(py1, by1)
                    jx = min(px2, bx2)
                    jy = min(py2, by2)
                    
                    if ix < jx and iy < jy:
                        events.append({
                            "type": "Suspected Smuggling (Contraband)",
                            "severity": "High",
                            "confidence": (p['confidence'] + b['confidence']) / 2,
                            "box": p['box']
                        })
                        
        # 3. Drone Detection (Aerial Threat)
        if detection_type in ["all", "drone"]:
            if drones:
                self.drone_detections += 1
                if self.drone_detections >= 1:
                    events.append({
                        "type": "Unidentified Aerial Object (Drone)",
                        "severity": "Critical",
                        "confidence": max([d['confidence'] for d in drones]),
                        "box": drones[0]['box']
                    })
                    self.drone_detections = 0
            else:
                self.drone_detections = 0
                
        # 4. Unauthorized Vehicle Activity
        if detection_type in ["all", "vehicle"]:
            if vehicles:
                self.vehicle_detections += 1
                if self.vehicle_detections >= 2:
                    events.append({
                        "type": "Unauthorized Vehicle Near Fence",
                        "severity": "High",
                        "confidence": max([v['confidence'] for v in vehicles]),
                        "box": vehicles[0]['box']
                    })
                    self.vehicle_detections = 0
            else:
                self.vehicle_detections = 0

        return events
