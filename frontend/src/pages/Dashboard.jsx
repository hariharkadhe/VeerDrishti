import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cctv, 
  AlertTriangle, 
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
  <div className="glass-panel p-6 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity ${colorClass.replace('text-', 'bg-')}`}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-xs font-bold text-primary/70 uppercase tracking-widest">{title}</p>
        <h3 className={`text-5xl font-bold mt-2 tracking-tight font-mono ${colorClass === 'text-danger' ? 'text-glow-danger' : colorClass === 'text-warning' ? 'text-glow-warning' : 'text-glow-primary text-primary'}`}>{value}</h3>
      </div>
      <div className={`p-4 rounded-none border border-current shadow-[inset_0_1px_5px_currentColor] bg-black/40 ${colorClass}`}>
        <Icon className={colorClass} size={28} style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest relative z-10">
        <span className={`${trend.isPositive ? "text-primary text-shadow" : "text-danger text-shadow"}`}>
          {trend.value}
        </span>
        <span className="text-primary/50">VS PREV SHIFT</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeCameras: 0,
    criticalAlerts: 0,
    eventsDetected: 0,
    resolved: 0
  });
  const [alertTypes, setAlertTypes] = useState([
    { label: 'Border Intrusion Detected', count: 0, color: 'bg-danger', shadow: 'shadow-neon-danger' },
    { label: 'Unidentified Aerial Object (Drone)', count: 0, color: 'bg-warning', shadow: 'shadow-[0_0_15px_rgba(255,176,0,0.5)]' },
    { label: 'Suspected Smuggling (Contraband)', count: 0, color: 'bg-primary', shadow: 'shadow-neon-primary' },
    { label: 'Unauthorized Vehicle Near Fence', count: 0, color: 'bg-orange-500', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]' }
  ]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [camerasRes, alertsRes] = await Promise.all([
          axios.get('http://localhost:8000/cameras/'),
          axios.get('http://localhost:8000/alerts/?limit=1000')
        ]);
        
        const cameras = camerasRes.data;
        const alerts = alertsRes.data;

        // Calculate Stats
        const activeCams = cameras.filter(c => c.status === 'Online').length;
        const critical = alerts.filter(a => a.severity.toLowerCase() === 'critical' && a.status === 'NEW').length;
        const resolvedAlerts = alerts.filter(a => a.status === 'CLOSED').length;
        
        setStats({
          activeCameras: activeCams,
          criticalAlerts: critical,
          eventsDetected: alerts.length,
          resolved: resolvedAlerts
        });

        // Calculate Types
        const typesCount = {
          'Border Intrusion Detected': 0,
          'Unidentified Aerial Object (Drone)': 0,
          'Suspected Smuggling (Contraband)': 0,
          'Unauthorized Vehicle Near Fence': 0
        };
        alerts.forEach(a => {
          if (typesCount[a.event_type] !== undefined) {
            typesCount[a.event_type]++;
          } else {
             typesCount[a.event_type] = 1;
          }
        });
        
        setAlertTypes(prev => prev.map(t => ({
          ...t,
          count: typesCount[t.label] || 0
        })));

        // Parse timestamps and group by hour for real chart data
        const hourlyCounts = {};
        
        // Initialize last 7 hours up to now
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 60 * 60 * 1000);
          const hour = d.getHours().toString().padStart(2, '0') + ':00';
          hourlyCounts[hour] = 0;
        }

        alerts.forEach(alert => {
          if (!alert.timestamp) return;
          const date = new Date(alert.timestamp + 'Z'); // ensure UTC parsing if needed
          const hour = date.getHours().toString().padStart(2, '0') + ':00';
          if (hourlyCounts[hour] !== undefined) {
            hourlyCounts[hour]++;
          }
        });

        const newChartData = Object.keys(hourlyCounts).map(time => ({
          time,
          alerts: hourlyCounts[time]
        }));
        
        setChartData(newChartData);

      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalTypes = alertTypes.reduce((acc, val) => acc + val.count, 0) || 1;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative z-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-widest uppercase text-glow-primary text-primary">Tactical Ops Center</h1>
          <p className="text-primary/70 mt-2 text-sm font-bold tracking-[0.2em] uppercase">Real-time threat monitoring - INB Sector 4</p>
        </div>
        <div className="px-6 py-3 bg-black/60 text-primary border border-primary shadow-[inset_0_0_15px_rgba(57,255,20,0.2)] rounded-none text-xs tracking-widest font-bold flex items-center gap-3">
          <span className="led led-success"></span>
          LIVE MONITORING ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active BOP Feeds" 
          value={stats.activeCameras} 
          icon={Cctv} 
          colorClass="text-primary" 
        />
        <StatCard 
          title="Critical Threats" 
          value={stats.criticalAlerts} 
          icon={AlertTriangle} 
          colorClass="text-danger" 
        />
        <StatCard 
          title="Anomalies Detected" 
          value={stats.eventsDetected} 
          icon={Activity} 
          colorClass="text-warning" 
        />
        <StatCard 
          title="Threats Neutralized" 
          value={stats.resolved} 
          icon={ShieldCheck} 
          colorClass="text-primary" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-bold tracking-widest uppercase mb-6 text-glow-primary text-primary">Threat Volume (Shift Timeline)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39ff14" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#39ff14" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(57,255,20,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="#39ff14" opacity={0.5} tick={{fill: '#39ff14', fontSize: 12, fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#39ff14" opacity={0.5} tick={{fill: '#39ff14', fontSize: 12, fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', borderColor: '#39ff14', color: '#39ff14', borderRadius: '0px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#39ff14', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="alerts" stroke="#39ff14" strokeWidth={3} fillOpacity={1} fill="url(#colorAlerts)" style={{ filter: 'drop-shadow(0 0 8px rgba(57,255,20,0.8))' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold tracking-widest uppercase mb-6 text-glow-primary text-primary">Intel by Vector</h3>
          <div className="space-y-6">
            {alertTypes.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between text-xs font-bold tracking-wider uppercase mb-2">
                  <span className="text-primary/70 group-hover:text-primary transition-colors">{item.label}</span>
                  <span className="font-mono text-glow-primary text-primary">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-black/60 rounded-none overflow-hidden border border-primary/20 shadow-inner">
                  <div className={`h-full ${item.color} ${item.shadow} rounded-none transition-all duration-1000`} style={{ width: `${(item.count / totalTypes) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
