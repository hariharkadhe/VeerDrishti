import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Camera as CameraIcon, Clock, CheckCircle, Navigation, XCircle } from 'lucide-react';
import axios from 'axios';

const AlertCard = ({ alert, onAction }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-danger bg-danger/10 border-danger/50 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/50 shadow-[inset_0_0_15px_rgba(249,115,22,0.2)]';
      case 'medium': return 'text-warning bg-warning/10 border-warning/50 shadow-[inset_0_0_15px_rgba(255,176,0,0.2)]';
      default: return 'text-primary bg-primary/10 border-primary/50 shadow-[inset_0_0_15px_rgba(57,255,20,0.2)]';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW': return <span className="px-3 py-1 rounded-none text-xs font-bold bg-danger/20 text-danger animate-pulse border border-danger/50 tracking-widest uppercase shadow-neon-danger">NEW THREAT</span>;
      case 'ACKNOWLEDGED': return <span className="px-3 py-1 rounded-none text-xs font-bold bg-warning/20 text-warning border border-warning/50 tracking-widest uppercase shadow-neon-warning">ACKNOWLEDGED</span>;
      case 'DISPATCHED': return <span className="px-3 py-1 rounded-none text-xs font-bold bg-primary/20 text-primary border border-primary/50 tracking-widest uppercase shadow-neon-primary">QRF DISPATCHED</span>;
      case 'CLOSED': return <span className="px-3 py-1 rounded-none text-xs font-bold bg-black/60 text-primary border border-primary/30 tracking-widest uppercase">NEUTRALIZED</span>;
      default: return null;
    }
  };

  return (
    <div className={`glass-panel p-5 relative overflow-hidden group hover:border-primary/50 transition-all ${alert.severity.toLowerCase() === 'critical' ? 'border-danger/50 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)] glitch-effect' : 'border-white/5'}`}>
       {/* 3D Inner highlight */}
       <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity ${alert.status === 'NEW' ? 'bg-danger' : 'bg-primary'}`}></div>
       
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-none border ${alert.status === 'NEW' ? 'bg-danger/20 border-danger shadow-[inset_0_1px_5px_rgba(239,68,68,0.5)] shadow-neon-danger' : 'bg-black/60 border-primary/50 shadow-inner'}`}>
            <ShieldAlert size={24} className={alert.status === 'NEW' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)]' : 'text-primary/70'} />
          </div>
          <div>
            <h3 className={`font-bold text-lg tracking-wider uppercase ${alert.status === 'NEW' ? 'text-glow-danger text-danger' : 'text-primary'}`}>{alert.event_type}</h3>
            <p className="text-xs text-primary/70 mt-1 font-mono tracking-widest">ID: #{alert.id} • CONF: {(alert.confidence * 100).toFixed(0)}%</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(alert.status)}
          <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase tracking-widest ${getSeverityColor(alert.severity)}`}>
            {alert.severity} Priority
          </span>
        </div>
      </div>

      {alert.evidence_path && (
        <div className="mb-4 relative z-10 rounded-none overflow-hidden border border-primary/30 shadow-[inset_0_0_20px_rgba(57,255,20,0.15)] relative group/img">
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none z-20 scanline-overlay"></div>
          <img src={`http://localhost:8000/${alert.evidence_path.replace('\\', '/')}`} alt="Evidence" className="w-full h-40 object-cover hover:scale-105 transition-transform duration-700 grayscale contrast-125 brightness-90 group-hover/img:grayscale-0 group-hover/img:brightness-100" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-y-3 text-xs font-mono text-primary/80 mb-6 bg-black/40 p-3 rounded-none border border-primary/20 relative z-10 shadow-inner">
        <div className="flex items-center gap-2">
          <CameraIcon size={14} className="text-primary/50" />
          <span>{alert.camera_id}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-primary/50" />
          <span>{new Date(alert.timestamp + 'Z').toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2 text-primary">
          <MapPin size={14} className="text-primary/50" />
          <span>{alert.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-primary/20 relative z-10">
        {alert.status === 'NEW' && (
          <button onClick={() => onAction(alert.id, 'acknowledge')} className="flex-1 py-2.5 rounded-none bg-black border border-warning text-warning font-bold tracking-widest text-xs hover:bg-warning/20 transition-all flex justify-center items-center gap-2 uppercase">
            <CheckCircle size={16} /> ACKNOWLEDGE
          </button>
        )}
        {alert.status === 'ACKNOWLEDGED' && (
          <button onClick={() => onAction(alert.id, 'dispatch')} className="flex-1 py-2.5 rounded-none bg-black border border-primary text-primary font-bold tracking-widest text-xs hover:bg-primary/20 transition-all flex justify-center items-center gap-2 uppercase">
            <Navigation size={16} /> SCRAMBLE QRF
          </button>
        )}
        {alert.status === 'DISPATCHED' && (
          <button onClick={() => onAction(alert.id, 'close')} className="flex-1 py-2.5 rounded-none bg-black border border-success text-success font-bold tracking-widest text-xs hover:bg-success/20 transition-all flex justify-center items-center gap-2 uppercase">
            <CheckCircle size={16} /> MARK NEUTRALIZED
          </button>
        )}
        {alert.status === 'CLOSED' && (
          <>
            <button className="flex-1 py-2.5 rounded-none bg-black border border-primary/30 text-primary/50 font-bold tracking-widest text-xs cursor-not-allowed shadow-inner uppercase">
              ARCHIVED IN HASH
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const LiveAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/alerts/');
      setAlerts(res.data);
    } catch (err) {
      console.error("Error fetching alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(); // Initial fetch
    
    // Poll every 2 seconds for real-time tactical updates
    const intervalId = setInterval(fetchAlerts, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleAction = async (alertId, actionType) => {
    try {
      if (actionType === 'delete') {
        await axios.delete(`http://localhost:8000/alerts/${alertId}`);
      } else {
        await axios.post(`http://localhost:8000/alerts/${alertId}/${actionType}?operator=Operator1`);
      }
      fetchAlerts(); // Refresh immediately
    } catch (err) {
      console.error(`Error performing action ${actionType} on alert ${alertId}`, err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end border-b border-primary/20 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest uppercase text-glow-danger text-danger flex items-center gap-3">
            <ShieldAlert size={32} className="glitch-effect" /> Active Threat Stream
          </h1>
          <p className="text-primary/70 mt-2 font-mono tracking-widest text-xs uppercase">VeerDrishti autonomous analytics pipeline</p>
        </div>
        <div className="text-xs font-mono font-bold tracking-widest text-primary/80 bg-black/60 px-4 py-2 border border-primary/30 uppercase">
          Tracking {alerts.length} Entities
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-20 pr-2 flex-1 items-start content-start auto-rows-max">
        {loading ? (
          <p className="text-primary/50 font-mono tracking-widest uppercase text-sm animate-pulse">Initializing data link...</p>
        ) : alerts.length > 0 ? (
          alerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} onAction={handleAction} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex p-5 border border-primary/30 bg-black/60 mb-6 text-primary shadow-[inset_0_0_15px_rgba(57,255,20,0.1)]">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-primary tracking-widest uppercase text-glow-primary">Sector Secure</h3>
            <p className="text-primary/50 mt-2 font-mono tracking-widest text-sm uppercase">No active threats detected in monitored zones.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAlerts;
