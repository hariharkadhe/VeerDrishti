import React, { useState } from 'react';
import { ShieldAlert, Fingerprint, Lock, User, Loader2, Target } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clearance, setClearance] = useState('LEVEL_1');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('CREDENTIALS REQUIRED FOR ACCESS.');
      return;
    }

    if (username !== 'admin' || password !== 'admin@12345' || clearance !== 'LEVEL_5') {
      setError('ACCESS DENIED: INSUFFICIENT CLEARANCE OR INVALID CREDENTIALS.');
      return;
    }

    setError('');
    setIsAuthenticating(true);

    // Mock authentication delay for realistic effect
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-slate-50 relative overflow-hidden font-sans">
      {/* Tactical Background Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay z-0"></div>
      
      {/* Ambient glowing radar orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary opacity-5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="glass-panel p-10 max-w-md w-full relative z-10 border border-primary/40 shadow-2xl overflow-hidden">
        {/* Animated HUD scanline */}
        <div className="hud-scanline"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-24 h-24 mx-auto rounded-none bg-black/60 flex items-center justify-center shadow-neon-primary border border-primary relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
            <Target size={48} className="text-primary relative z-10" style={{ filter: 'drop-shadow(0 0 10px #39ff14)' }} />
          </div>
          <Shield className="text-primary mx-auto mb-4" size={48} />
          <h1 className="text-4xl font-bold tracking-widest text-glow-primary uppercase font-mono">
            VeerDrishti
          </h1>
          <p className="text-primary/70 mt-2 font-mono tracking-widest text-sm uppercase">Border Operations Command</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-danger/20 border border-danger text-danger text-sm font-bold flex items-center justify-center shadow-neon-danger tracking-wider">
            [!] {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-bold text-primary/80 uppercase tracking-widest mb-2">Operator ID</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-primary/50 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/80 border border-primary/30 rounded-none py-3 pl-10 pr-4 text-primary placeholder-primary/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                placeholder="OP-ID (e.g. admin)"
                disabled={isAuthenticating}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary/80 uppercase tracking-widest mb-2">Passcode</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-primary/50 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/80 border border-primary/30 rounded-none py-3 pl-10 pr-4 text-primary placeholder-primary/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                placeholder="••••••••"
                disabled={isAuthenticating}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary/80 uppercase tracking-widest mb-2">Clearance Level</label>
            <select 
              value={clearance}
              onChange={(e) => setClearance(e.target.value)}
              className="w-full bg-black/80 border border-primary/30 rounded-none py-3 px-4 text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono appearance-none"
              disabled={isAuthenticating}
            >
              <option value="LEVEL_1">LEVEL 1 - STANDARD</option>
              <option value="LEVEL_3">LEVEL 3 - SUPERVISOR</option>
              <option value="LEVEL_5">LEVEL 5 - COMMANDER</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isAuthenticating}
            className={`w-full py-4 font-bold text-sm tracking-[0.2em] flex justify-center items-center gap-3 transition-all duration-300 uppercase
              ${isAuthenticating 
                ? 'bg-black/50 border border-primary/30 text-primary/50 cursor-not-allowed' 
                : 'bg-primary/20 border border-primary text-primary hover:bg-primary/30 hover:shadow-neon-primary hover:scale-[1.02]'}`}
          >
            {isAuthenticating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                VERIFYING...
              </>
            ) : (
              <>
                <Fingerprint size={20} />
                AUTHORIZE LINK
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-primary/20 pt-6">
          <p className="text-[10px] text-primary/50 uppercase tracking-[0.3em]">
            Sashastra Seema Bal (SSB) • Authorized Eyes Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
