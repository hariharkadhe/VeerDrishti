import React, { useState } from 'react';
import { AlertTriangle, Shield, Volume2, ShieldAlert, Radio, Activity, Terminal, Scan } from 'lucide-react';
import axios from 'axios';

const ThreatCenter = () => {
  const [threatLevel, setThreatLevel] = useState('ELEVATED');
  const [broadcasting, setBroadcasting] = useState(false);
  const [message, setMessage] = useState('');

  const handleLevelChange = (level) => {
    setThreatLevel(level);
    // In a real app, this would ping the backend to update global state and notify all clients
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!message) return;
    
    setBroadcasting(true);
    setTimeout(() => {
      setBroadcasting(false);
      setMessage('');
      alert('Broadcast transmitted to all Sector BOPs successfully.');
    }, 2000);
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'CRITICAL': return 'bg-danger text-white border-danger shadow-neon-danger';
      case 'HIGH': return 'bg-warning text-black border-warning shadow-neon-warning';
      case 'ELEVATED': return 'bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]';
      case 'NORMAL': return 'bg-primary/20 text-primary border-primary shadow-neon-primary';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10 space-y-8">
      <div className="flex justify-between items-end border-b border-primary/20 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest uppercase text-glow-primary text-primary flex items-center gap-3">
            <ShieldAlert size={32} /> Tactical Threat Center
          </h1>
          <p className="text-primary/70 mt-2 font-mono tracking-widest text-xs uppercase">Global Threat Level & Emergency Protocols</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-black/60 border border-primary/50 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)] flex items-center gap-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-primary/70">CURRENT STATUS</span>
            <div className={`px-4 py-1 font-bold font-mono tracking-widest uppercase text-sm border ${getLevelColor(threatLevel)} animate-pulse`}>
              {threatLevel}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Threat Level Controls */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Radar Scanner Component */}
          <div className="glass-panel p-6 border border-primary/30 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)] flex items-center justify-between">
             <div>
               <h2 className="text-xl font-bold text-primary tracking-widest uppercase font-mono mb-2 flex items-center gap-2">
                 <Scan size={20} className={threatLevel === 'CRITICAL' ? 'text-danger animate-pulse' : 'text-primary'} /> Sub-Space Radar Uplink
               </h2>
               <p className={`text-xs font-mono tracking-widest uppercase ${threatLevel === 'CRITICAL' ? 'text-danger glitch-effect' : 'text-primary/70'}`}>
                 {threatLevel === 'CRITICAL' ? 'MULTIPLE HOSTILES DETECTED IN SECTOR 4' : 'SCANNING FOR ANOMALIES...'}
               </p>
             </div>
             
             <div className="w-24 h-24 radar-container border border-primary/50 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
               <div className="radar-sweep"></div>
               {/* Blips */}
               {threatLevel === 'CRITICAL' && (
                 <>
                   <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-danger rounded-full shadow-[0_0_8px_rgba(239,68,68,1)] animate-ping"></div>
                   <div className="absolute bottom-6 right-8 w-1 h-1 bg-danger rounded-full shadow-[0_0_8px_rgba(239,68,68,1)] animate-ping" style={{animationDelay: '0.5s'}}></div>
                 </>
               )}
             </div>
          </div>

          <div className={`glass-panel p-6 border ${threatLevel === 'CRITICAL' ? 'border-danger/50 shadow-[inset_0_0_30px_rgba(239,68,68,0.2)] glitch-effect' : 'border-primary/30 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)]'}`}>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase font-mono mb-6 flex items-center gap-2 border-b border-primary/20 pb-4">
              <Activity size={20} /> DEFCON Protocol Selector
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { level: 'CRITICAL', desc: 'Active Engagement', color: 'border-danger text-danger hover:bg-danger/20 hover:shadow-neon-danger' },
                { level: 'HIGH', desc: 'Imminent Threat', color: 'border-warning text-warning hover:bg-warning/20 hover:shadow-neon-warning' },
                { level: 'ELEVATED', desc: 'Heightened Intel', color: 'border-orange-500 text-orange-500 hover:bg-orange-500/20 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]' },
                { level: 'NORMAL', desc: 'Standard Ops', color: 'border-primary text-primary hover:bg-primary/20 hover:shadow-neon-primary' }
              ].map((item) => (
                <button 
                  key={item.level}
                  onClick={() => handleLevelChange(item.level)}
                  className={`p-4 border bg-black/40 flex flex-col items-center justify-center gap-2 transition-all duration-300 font-mono ${threatLevel === item.level ? getLevelColor(item.level) : item.color}`}
                >
                  <span className="text-lg font-bold tracking-widest">{item.level}</span>
                  <span className="text-[10px] tracking-widest uppercase opacity-80 text-center">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 border border-danger/30 bg-danger/10 text-danger/80 font-mono text-xs tracking-widest uppercase flex items-start gap-4">
              <AlertTriangle size={24} className="text-danger flex-shrink-0" />
              <p>Warning: Elevating threat level to HIGH or CRITICAL will automatically scramble QRF teams and trigger automated lockdown protocols across all linked border outposts. This action is logged in the immutable audit blockchain.</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel p-6 border border-primary/30 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)]">
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase font-mono mb-6 flex items-center gap-2 border-b border-primary/20 pb-4">
              <Terminal size={20} /> Automated Countermeasures
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <button className="px-4 py-3 bg-black border border-danger/50 text-danger hover:bg-danger/20 font-bold font-mono text-xs tracking-widest uppercase transition-all shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]">
                  INITIATE LOCKDOWN
               </button>
               <button className="px-4 py-3 bg-black border border-warning/50 text-warning hover:bg-warning/20 font-bold font-mono text-xs tracking-widest uppercase transition-all shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]">
                  ACTIVATE PERIMETER ALARMS
               </button>
               <button className="px-4 py-3 bg-black border border-primary/50 text-primary hover:bg-primary/20 font-bold font-mono text-xs tracking-widest uppercase transition-all shadow-[inset_0_0_10px_rgba(57,255,20,0.2)]">
                  SCRAMBLE DRONE SWARM
               </button>
            </div>
          </div>
        </div>

        {/* Emergency Broadcast */}
        <div className="col-span-1">
          <div className="glass-panel p-6 border border-primary/30 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)] h-full flex flex-col">
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase font-mono mb-6 flex items-center gap-2 border-b border-primary/20 pb-4">
              <Radio size={20} /> Secure Comms Uplink
            </h2>
            <p className="text-xs font-mono text-primary/70 tracking-widest uppercase mb-6">
              Transmit priority encrypted messages to all Sector BOPs and QRF units.
            </p>
            
            <form onSubmit={handleBroadcast} className="flex-1 flex flex-col">
              <textarea 
                className="w-full flex-1 bg-black/60 border border-primary/30 p-4 text-primary font-mono text-sm tracking-widest outline-none focus:border-primary shadow-[inset_0_0_10px_rgba(57,255,20,0.1)] resize-none mb-4"
                placeholder="ENTER PRIORITY MESSAGE..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button 
                type="submit"
                disabled={broadcasting || !message}
                className={`w-full py-4 font-bold font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                  broadcasting || !message ? 'bg-black border border-primary/20 text-primary/30 cursor-not-allowed' : 'bg-primary/20 border border-primary text-primary hover:bg-primary/30 shadow-neon-primary'
                }`}
              >
                <Volume2 size={18} className={broadcasting ? 'animate-pulse' : ''} />
                {broadcasting ? 'TRANSMITTING...' : 'BROADCAST MESSAGE'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThreatCenter;
