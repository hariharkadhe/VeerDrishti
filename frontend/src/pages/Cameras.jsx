import React, { useState, useEffect } from 'react';
import { Camera, WifiOff, Settings2, Maximize2, AlertTriangle, MapPin, Radio } from 'lucide-react';
import axios from 'axios';

const CameraCard = ({ camera }) => {
  return (
    <div className="glass-panel overflow-hidden group flex flex-col h-full border border-primary/30 hover:border-primary/80 transition-all shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
      {/* Header */}
      <div className="p-3 bg-black/80 border-b border-primary/20 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-primary/70" />
          <span className="font-mono font-bold text-sm text-primary tracking-widest">{camera.camera_id}</span>
        </div>
        <div className="flex gap-2">
          {camera.status === 'Online' ? (
             <span className="px-2 py-0.5 rounded-none flex items-center gap-1 text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/30 shadow-[inset_0_0_8px_rgba(57,255,20,0.2)] tracking-widest">
              <span className="w-1.5 h-1.5 rounded-none bg-primary animate-pulse"></span>
              LINK ACTIVE
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-none flex items-center gap-1 text-[10px] font-bold uppercase bg-danger/10 text-danger border border-danger/30 shadow-[inset_0_0_8px_rgba(239,68,68,0.2)] tracking-widest">
              <span className="w-1.5 h-1.5 rounded-none bg-danger"></span>
              NO SIGNAL
            </span>
          )}
        </div>
      </div>

      {/* Video Feed Placeholder (Blank/Offline) */}
      <div className="relative flex-1 bg-black min-h-[220px] flex items-center justify-center overflow-hidden border-b border-primary/20 group-hover:bg-primary/5 transition-colors">
        {/* Subtle static overlay effect */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen pointer-events-none scanline-overlay"></div>
        
        <div className="text-center relative z-10">
          {camera.status === 'Online' ? (
            <div className="flex flex-col items-center">
               <Radio size={40} className="mx-auto text-primary mb-3 opacity-60 animate-pulse" />
               <p className="text-primary font-mono text-sm tracking-widest uppercase mb-1">SECURE FEED</p>
               <p className="text-primary/60 text-[10px] font-mono tracking-widest">ENCRYPTED STREAM</p>
            </div>
          ) : (
            <>
              <WifiOff size={40} className="mx-auto text-danger mb-3 opacity-50" />
              <p className="text-danger font-mono text-sm tracking-widest uppercase mb-1">UPLINK LOST</p>
              <p className="text-danger/60 text-[10px] font-mono tracking-widest">AWAITING HANDSHAKE</p>
            </>
          )}
          
          <p className="text-primary/40 text-[9px] font-mono mt-3 border border-primary/20 px-2 py-1 rounded-none inline-block bg-black">
            {camera.rtsp_url || `rtsp://classified.net:554/${camera.camera_id}`}
          </p>
        </div>

        {/* Glitch lines */}
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-primary/10 shadow-[0_0_5px_rgba(57,255,20,0.2)]"></div>
        <div className="absolute top-2/3 left-0 w-full h-[2px] bg-primary/10 shadow-[0_0_5px_rgba(57,255,20,0.2)]"></div>
      </div>

      {/* Footer controls */}
      <div className="p-2.5 bg-black/80 flex justify-between items-center text-primary/50 relative z-10">
        <div className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
           <MapPin size={12}/> {camera.location}
        </div>
        <div className="flex gap-4">
          <button className="hover:text-primary transition-colors" title="Settings"><Settings2 size={14} /></button>
          <button className="hover:text-warning transition-colors" title="Diagnostics"><AlertTriangle size={14} /></button>
          <button className="hover:text-primary transition-colors" title="Fullscreen"><Maximize2 size={14} /></button>
        </div>
      </div>
    </div>
  );
};

const Cameras = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCamId, setNewCamId] = useState('');
  const [newRtspUrl, setNewRtspUrl] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const fetchCameras = async () => {
    try {
      const res = await axios.get('http://localhost:8000/cameras/');
      setCameras(res.data);
    } catch (err) {
      console.error("Error fetching cameras", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const handleAddCamera = async (e) => {
    e.preventDefault();
    if (!newCamId || !newLocation) return;
    try {
      await axios.post('http://localhost:8000/cameras/', {
        camera_id: newCamId,
        location: newLocation,
        status: newRtspUrl ? 'Online' : 'Offline',
        rtsp_url: newRtspUrl
      });
      setShowAddModal(false);
      setNewCamId('');
      setNewRtspUrl('');
      setNewLocation('');
      fetchCameras();
    } catch (error) {
      console.error("Error adding camera", error);
      alert("Failed to add camera uplink.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10">
      <div className="flex justify-between items-end mb-8 border-b border-primary/20 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest uppercase text-glow-primary text-primary">Border Surveillance Grid</h1>
          <p className="text-primary/70 mt-2 font-mono tracking-widest text-xs uppercase">BOP RTSP Stream Matrix</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-black/60 text-primary border border-primary/50 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)] rounded-none text-xs font-mono tracking-widest font-bold flex items-center gap-3">
            <span className="led led-success"></span>
            {cameras.filter(c => c.status === 'Online').length} FEEDS SECURED
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary/20 text-primary border border-primary text-glow-primary shadow-neon-primary rounded-none text-xs font-mono tracking-widest uppercase font-bold flex items-center gap-2 hover:bg-primary/30 transition-colors"
          >
            + ADD CAMERA UPLINK
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-panel p-6 border border-primary shadow-neon-primary max-w-md w-full">
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase font-mono mb-4 border-b border-primary/20 pb-2">Initialize New Uplink</h2>
            <form onSubmit={handleAddCamera} className="space-y-4 font-mono text-sm tracking-widest">
              <div>
                <label className="block text-[10px] text-primary/70 uppercase mb-1">Camera ID</label>
                <input 
                  required
                  type="text" 
                  value={newCamId}
                  onChange={(e) => setNewCamId(e.target.value)}
                  placeholder="e.g. BOP-IND-NEP-005"
                  className="w-full bg-black/60 border border-primary/30 text-primary px-4 py-2 outline-none focus:border-primary shadow-[inset_0_0_5px_rgba(57,255,20,0.2)] placeholder-primary/30 uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] text-primary/70 uppercase mb-1">Location / Sector</label>
                <input 
                  required
                  type="text" 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Sector 5 Alpha"
                  className="w-full bg-black/60 border border-primary/30 text-primary px-4 py-2 outline-none focus:border-primary shadow-[inset_0_0_5px_rgba(57,255,20,0.2)] placeholder-primary/30 uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] text-primary/70 uppercase mb-1">RTSP Stream URL (Optional)</label>
                <input 
                  type="text" 
                  value={newRtspUrl}
                  onChange={(e) => setNewRtspUrl(e.target.value)}
                  placeholder="rtsp://..."
                  className="w-full bg-black/60 border border-primary/30 text-primary px-4 py-2 outline-none focus:border-primary shadow-[inset_0_0_5px_rgba(57,255,20,0.2)] placeholder-primary/30"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-black border border-primary/50 text-primary hover:bg-primary/20 transition-all uppercase font-bold text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-primary/20 border border-primary text-primary hover:bg-primary/30 shadow-neon-primary transition-all uppercase font-bold text-xs"
                >
                  Confirm Uplink
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-primary/50 font-mono tracking-widest uppercase text-sm animate-pulse">Establishing uplink...</p>
      ) : cameras.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-primary/50 border border-dashed border-primary/30">
           <Camera size={48} className="mb-4 opacity-50" />
           <p className="font-mono tracking-widest uppercase text-sm">NO CAMERA UPLINKS DETECTED IN MATRIX</p>
           <p className="font-mono tracking-widest uppercase text-[10px] mt-2">CLICK 'ADD CAMERA UPLINK' TO INITIALIZE SECTOR SURVEILLANCE</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cameras.map((cam, i) => (
            <CameraCard key={cam.id || i} camera={cam} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cameras;

