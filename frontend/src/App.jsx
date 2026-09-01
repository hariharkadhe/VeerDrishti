import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Crosshair, 
  Scan, 
  AlertTriangle, 
  Cctv, 
  Map as MapIcon, 
  LineChart, 
  Settings,
  Shield,
  LogOut,
  Link2,
  Activity
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import VideoAnalysis from './pages/VideoAnalysis';
import LiveAlerts from './pages/LiveAlerts';
import Login from './pages/Login';
import Cameras from './pages/Cameras';
import Analytics from './pages/Analytics';
import Map from './pages/Map';

import AuditLog from './pages/AuditLog';
import ThreatCenter from './pages/ThreatCenter';

const SidebarItem = ({ icon: Icon, label, to, isActive }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors duration-200 border-l-2 ${
      isActive 
        ? 'bg-primary/20 text-primary border-primary shadow-[inset_4px_0_0_0_#39ff14]' 
        : 'border-transparent text-primary/50 hover:bg-primary/5 hover:text-primary hover:border-primary/50'
    }`}
  >
    <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
    <span className="font-bold tracking-wider uppercase text-xs">{label}</span>
  </Link>
);

const AppLayout = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sentinelai_auth') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('sentinelai_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('sentinelai_auth');
    setIsAuthenticated(false);
  };
  
  const navItems = [
    { icon: Crosshair, label: 'Ops Center', path: '/' },
    { icon: AlertTriangle, label: 'Threat Alerts', path: '/alerts' },
    { icon: Cctv, label: 'BOP Feeds', path: '/cameras' },
    { icon: MapIcon, label: 'Sector Map', path: '/map' },
    { icon: Scan, label: 'Intel Analysis', path: '/analysis' },
    { icon: LineChart, label: 'Intel Charts', path: '/analytics' },
    { icon: Link2, label: 'Audit Log', path: '/audit' },
    { icon: Activity, label: 'Threat Center', path: '/threats' },
  ];

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background text-slate-50 overflow-hidden font-sans relative">
      {/* Tactical Background Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none mix-blend-overlay z-0"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-primary/20 bg-black/80 backdrop-blur-3xl relative z-20">
        <div className="p-6 flex items-center gap-4 border-b border-primary/20">
          <div className="w-12 h-12 bg-black flex items-center justify-center shadow-neon-primary border border-primary relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
            <Shield size={28} className="text-primary relative z-10" style={{ filter: 'drop-shadow(0 0 5px #39ff14)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-primary text-glow-primary uppercase">
              VeerDrishti
            </h1>
            <p className="text-[10px] text-primary/70 font-semibold tracking-[0.2em] uppercase">SSB Command</p>
          </div>
        </div>
        
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.path}
              icon={item.icon} 
              label={item.label} 
              to={item.path} 
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t border-primary/20 flex flex-col gap-2">
          <SidebarItem icon={Settings} label="System Config" to="/settings" isActive={location.pathname === '/settings'} />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full border-l-2 border-transparent text-sm font-bold uppercase tracking-wider transition-colors text-primary/50 hover:text-danger hover:bg-danger/10 hover:border-danger group mt-2"
          >
            <LogOut size={18} className="group-hover:text-danger" />
            Terminate Link
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10 custom-scrollbar">
        <header className="h-20 border-b border-primary/20 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-primary/80">
            <span className="px-3 py-1 bg-primary/10 border border-primary/30 shadow-[inset_0_0_10px_rgba(57,255,20,0.1)]">INB SECTOR 4</span>
            <span className="w-1 h-1 bg-primary/50"></span>
            <span className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 border border-primary/30">
              <span className="led led-success"></span>
              SECURE LINK ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-2 uppercase">
              <p className="text-sm font-bold text-primary tracking-widest">OP-ID: ADMIN</p>
              <p className="text-[10px] text-primary/70 font-semibold tracking-widest">LEVEL 5 CLEARANCE</p>
            </div>
            <div className="w-11 h-11 rounded-none bg-black border border-primary shadow-neon-primary flex items-center justify-center font-bold text-primary text-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
               <span className="relative z-10 tracking-widest">L5</span>
            </div>
          </div>
        </header>
        
        <div className="animate-in fade-in duration-500 h-[calc(100%-5rem)]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis" element={<VideoAnalysis />} />
            <Route path="/alerts" element={<LiveAlerts />} />
            <Route path="/cameras" element={<Cameras />} />
            <Route path="/map" element={<Map />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/threats" element={<ThreatCenter />} />
            <Route path="/settings" element={<div className="p-8 text-primary font-mono text-xl tracking-widest">SYSTEM CONFIGURATION</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
