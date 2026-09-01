import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Link2, Shield, Search, Lock } from 'lucide-react';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/audit/')
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch audit logs", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10 space-y-6">
      <div className="flex justify-between items-end mb-8 border-b border-primary/20 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest uppercase text-glow-primary text-primary flex items-center gap-3">
            <Database size={32} /> Audit Blockchain
          </h1>
          <p className="text-primary/70 mt-2 font-mono tracking-widest text-xs uppercase">Immutable Cryptographic Ledger of Sector Events</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-black/60 text-primary border border-primary/50 shadow-[inset_0_0_10px_rgba(57,255,20,0.1)] rounded-none text-xs font-mono tracking-widest uppercase font-bold flex items-center gap-2">
            <Shield size={16} /> SHA-256 SECURED
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 border border-primary/30 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)]">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold text-primary tracking-widest uppercase font-mono">Ledger Nodes</h3>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
             <input type="text" placeholder="SEARCH HASH..." className="bg-black/60 border border-primary/30 text-primary px-10 py-2 font-mono text-xs tracking-widest outline-none focus:border-primary shadow-[inset_0_0_5px_rgba(57,255,20,0.2)] placeholder-primary/30 w-64" />
           </div>
        </div>
        <div className="space-y-4">
          {loading ? (
             <div className="text-center py-12 text-primary/50 font-mono tracking-widest uppercase text-sm animate-pulse">Syncing nodes...</div>
          ) : logs.length === 0 ? (
             <div className="text-center py-12 text-primary/50 font-mono tracking-widest uppercase text-sm">Ledger is empty.</div>
          ) : (
             logs.map((log, idx) => (
                <div key={log.id} className="relative group pl-8">
                  {/* Blockchain Link Visual */}
                  {idx !== logs.length - 1 && (
                     <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-primary/20 shadow-[0_0_5px_rgba(57,255,20,0.2)]"></div>
                  )}
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-none border border-primary bg-black flex items-center justify-center text-primary shadow-neon-primary">
                    <Link2 size={12} />
                  </div>
                  
                  <div className="bg-black/40 border border-primary/20 p-4 hover:border-primary/50 transition-colors shadow-[inset_0_0_10px_rgba(57,255,20,0.05)]">
                     <div className="flex justify-between items-start mb-2 border-b border-primary/10 pb-2">
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-mono tracking-widest text-primary/50">BLOCK #{log.id}</span>
                           <span className="px-2 py-0.5 border border-primary/50 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">{log.action_type}</span>
                        </div>
                        <span className="text-xs font-mono text-primary/70">{new Date(log.timestamp + 'Z').toLocaleString()}</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                           <p className="text-[10px] text-primary/40 font-mono uppercase tracking-widest mb-1">Target Entity</p>
                           <p className="text-sm text-primary font-mono">{log.target_id}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-primary/40 font-mono uppercase tracking-widest mb-1">Operator</p>
                           <p className="text-sm text-primary font-mono flex items-center gap-2"><Lock size={12} className="text-primary/50"/> {log.operator}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                           <p className="text-[10px] text-primary/40 font-mono uppercase tracking-widest mb-1">Cryptographic Hash</p>
                           <p className="text-xs text-primary/70 font-mono break-all bg-black p-2 border border-primary/20 cursor-text select-all">{log.hash_signature}</p>
                        </div>
                     </div>
                  </div>
                </div>
             ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
