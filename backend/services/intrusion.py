import numpy as np

class VirtualTripwire:
    def __init__(self):
        # Maps camera_id to a list of tripwire lines (x1, y1, x2, y2)
        self.camera_lines = {}
        
    def add_line(self, camera_id: str, line_coords: tuple):
        """Add a restricted zone boundary line for a camera"""
        if camera_id not in self.camera_lines:
            self.camera_lines[camera_id] = []
        self.camera_lines[camera_id].append(line_coords)
        
    def check_intrusion(self, camera_id: str, bbox: tuple):
        """
        Check if a bounding box (px1, py1, px2, py2) crosses any tripwire 
        for the given camera.
        """
        if camera_id not in self.camera_lines:
            return False
            
        px1, py1, px2, py2 = bbox
        
        # We calculate the bottom-center of the bounding box (feet of the person)
        bc_x = (px1 + px2) / 2.0
        bc_y = py2
        
        for line in self.camera_lines[camera_id]:
            x1, y1, x2, y2 = line
            
            # Simple bounding box overlap check with line segment 
            # In a real engine, this would use vector cross products to detect line crossing
            # between previous frame and current frame. For prototype, we check if the 
            # bottom-center point is 'below' or 'past' the line depending on orientation.
            
            # Simplified distance check to the line for prototype:
            dist = self._point_to_line_dist(bc_x, bc_y, x1, y1, x2, y2)
            if dist < 20.0:  # If within 20 pixels of the tripwire
                return True
                
        return False
        
    def _point_to_line_dist(self, px, py, x1, y1, x2, y2):
        # Distance from point (px, py) to line segment (x1,y1)->(x2,y2)
        line_mag = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        if line_mag < 0.000001:
            return 9999.0
            
        u1 = (((px - x1) * (x2 - x1)) + ((py - y1) * (y2 - y1)))
        u = u1 / (line_mag ** 2)
        
        if (u < 0.00001) or (u > 1):
            # closest point does not fall within the line segment
            ix = self._dist(px, py, x1, y1)
            iy = self._dist(px, py, x2, y2)
            if ix > iy:
                return iy
            else:
                return ix
        else:
            # Intersecting point is on the line
            ix = x1 + u * (x2 - x1)
            iy = y1 + u * (y2 - y1)
            return self._dist(px, py, ix, iy)
            
    def _dist(self, x1, y1, x2, y2):
        return np.sqrt((x2-x1)**2 + (y2-y1)**2)

tripwire_engine = VirtualTripwire()
