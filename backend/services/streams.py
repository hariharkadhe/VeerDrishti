import cv2
import threading
import time

class RTSPStreamService:
    def __init__(self):
        self.active_streams = {}
        self.stream_threads = {}

    def start_stream(self, camera_id: str, rtsp_url: str):
        if camera_id in self.active_streams:
            return False, "Stream already active"

        self.active_streams[camera_id] = {"status": "Starting", "url": rtsp_url, "frames_processed": 0}
        
        # Start background thread to read stream
        thread = threading.Thread(target=self._process_stream, args=(camera_id, rtsp_url))
        thread.daemon = True
        thread.start()
        self.stream_threads[camera_id] = thread
        
        return True, "Stream started"

    def stop_stream(self, camera_id: str):
        if camera_id in self.active_streams:
            self.active_streams[camera_id]["status"] = "Stopping"
            # Thread will exit on next loop
            return True, "Stream stopping"
        return False, "Stream not found"

    def _process_stream(self, camera_id: str, rtsp_url: str):
        # In a real app, this would use cv2.VideoCapture(rtsp_url)
        # For prototype, we simulate reading frames
        self.active_streams[camera_id]["status"] = "Live"
        
        try:
            while self.active_streams.get(camera_id, {}).get("status") == "Live":
                # Simulate frame read delay (e.g., 30 FPS)
                time.sleep(0.033)
                self.active_streams[camera_id]["frames_processed"] += 1
                
                # Here we would normally yield the frame or send to inference queue
                # e.g., inference_queue.put(frame)
                
        except Exception as e:
            print(f"Stream {camera_id} error: {e}")
            
        if camera_id in self.active_streams:
            del self.active_streams[camera_id]

    def get_stream_status(self, camera_id: str):
        return self.active_streams.get(camera_id, {"status": "Offline"})

stream_service = RTSPStreamService()
