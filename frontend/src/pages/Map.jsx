import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { Camera, ShieldAlert, Crosshair } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Custom icons using Lucide and Tailwind via Leaflet divIcon
const createCustomIcon = (type, isCritical) => {
  const iconMarkup = renderToStaticMarkup(
    <div className={`relative flex items-center justify-center w-8 h-8 rounded-none ${isCritical ? 'bg-danger/20 border border-danger shadow-neon-danger animate-pulse' : 'bg-primary/20 border border-primary shadow-[inset_0_0_10px_rgba(57,255,20,0.5)]'} backdrop-blur-sm`}>
      {type === 'camera' ? (
        <Crosshair size={16} className={isCritical ? 'text-danger' : 'text-primary animate-[spin_4s_linear_infinite]'} />
      ) : (
        <ShieldAlert size={16} className={isCritical ? 'text-danger' : 'text-primary'} />
      )}
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const Map = () => {
  const [alerts, setAlerts] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Center on India-Nepal border (Sonauli)
  const borderCenter = [27.4727, 83.4735];

  const fetchData = async () => {
    try {
      const [alertsRes, camerasRes] = await Promise.all([
        axios.get('http://localhost:8000/alerts/'),
        axios.get('http://localhost:8000/cameras/')
      ]);
      setAlerts(alertsRes.data.filter(a => a.status !== 'CLOSED'));
      setCameras(camerasRes.data);
    } catch (err) {
      console.error("Error fetching map data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col p-8 pb-0 relative z-10">
      <div className="mb-6 flex justify-between items-end border-b border-primary/20 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest uppercase text-glow-primary text-primary flex items-center gap-3">
             <Crosshair size={32} /> Sector Topography
          </h1>
          <p className="text-primary/70 mt-2 font-mono tracking-widest text-xs uppercase">Live geospatial tracking of BOPs and anomaly vectors.</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden border border-primary/50 shadow-[0_0_30px_rgba(57,255,20,0.1)] relative isolate scanline-overlay">
        {/* Radar sweep animation overlay */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden mix-blend-screen">
            <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 bg-[conic-gradient(from_0deg,transparent_70%,rgba(57,255,20,0.1)_100%)] animate-[spin_4s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full shadow-neon-primary -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <MapContainer center={borderCenter} zoom={7} style={{ height: '100%', width: '100%', background: '#000' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          
          {/* Plot Cameras */}
          {cameras.map((cam, idx) => {
            const hasAlert = alerts.some(a => a.camera_id === cam.camera_id);
            return (
              <Marker 
                key={`cam-${idx}`} 
                position={[cam.latitude, cam.longitude]}
                icon={createCustomIcon('camera', hasAlert)}
              >
                <Popup className="custom-popup">
                  <div className="p-2 bg-black border border-primary shadow-neon-primary text-primary font-mono rounded-none">
                    <h3 className="font-bold text-base tracking-widest uppercase border-b border-primary/30 pb-2 mb-2">{cam.location}</h3>
                    <p className="text-xs mt-1">ID: {cam.camera_id}</p>
                    <div className="mt-3 text-xs">
                      <span className={`px-2 py-1 border font-bold uppercase tracking-widest ${cam.status === 'Online' ? 'bg-primary/20 text-primary border-primary' : 'bg-danger/20 text-danger border-danger'}`}>
                        {cam.status === 'Online' ? 'UPLINK ESTABLISHED' : 'UPLINK LOST'}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Plot Alerts - offset dynamically based on idx so they don't overlap if there are multiple */}
          {alerts.map((alert, idx) => {
            const cam = cameras.find(c => c.camera_id === alert.camera_id);
            // Create a small circular fan-out offset for multiple alerts
            const angle = idx * (Math.PI / 4); // 45 degrees apart
            const distance = 0.05;
            const pos = cam 
              ? [cam.latitude + Math.sin(angle) * distance, cam.longitude + Math.cos(angle) * distance] 
              : [borderCenter[0] + Math.sin(angle) * distance, borderCenter[1] + Math.cos(angle) * distance];
              
            return (
              <Marker 
                key={`alert-${alert.id}`} 
                position={pos}
                icon={createCustomIcon('alert', true)}
              >
                <Popup className="custom-popup">
                  <div className="p-2 bg-black border border-danger shadow-neon-danger text-danger font-mono rounded-none max-w-[250px]">
                    <h3 className="font-bold text-base tracking-widest uppercase border-b border-danger/30 pb-2 mb-2">{alert.event_type}</h3>
                    <p className="text-xs mt-1">{alert.location}</p>
                    {alert.evidence_path && (
                      <img src={`http://localhost:8000/${alert.evidence_path.replace('\\', '/')}`} className="w-full h-24 object-cover mt-3 border border-danger/50 grayscale contrast-125" alt="Evidence" />
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #000 !important;
        }
        .map-tiles {
          filter: invert(100%) sepia(100%) saturate(1000%) hue-rotate(80deg) brightness(50%) contrast(150%);
        }
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 0;
        }
        .leaflet-popup-tip {
          display: none;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .custom-leaflet-icon {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Map;
